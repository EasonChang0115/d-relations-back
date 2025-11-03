import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/modules/users/users.service';
import { PasswordService } from './services/password.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '@/modules/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await this.passwordService.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('該帳戶已被停用');
    }

    return user;
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, ...userData } = registerDto;

    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('該電子郵件已被註冊');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hashPassword(password);

    // Create user
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      sessionId: uuidv4(),
      name: userData.name,
      organization_code: userData.organization_code,
      job_title: userData.job_title,
      certification_status: userData.certification_status,
    } as any);

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      email: user.email || '',
      name: user.name || '',
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('無效的 email 或密碼');
    }

    // Update last login time
    await this.usersService.updateLastLogin(user.id);

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      email: user.email || '',
      name: user.name || '',
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refresh.secret'),
      });

      const user = await this.usersService.findOne(payload.sub);
      const tokens = this.generateTokens(user.id, user.email, user.role);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        email: user.email || '',
        name: user.name || '',
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh Token 無效或已過期');
    }
  }

  async logout(userId: string): Promise<void> {
    // Implementation for token blacklist would go here
    // For now, just a placeholder for future Redis-based blacklist
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return { message: '如果該電子郵件已註冊，將發送重設連結' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await this.usersService.update(user.id, {
      passwordResetToken: resetTokenHash,
      passwordResetExpires: resetExpires,
    } as any);

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    // await this.mailService.sendPasswordReset(user.email, resetUrl);

    return { message: '如果該電子郵件已註冊，將發送重設連結' };
  }

  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Note: In production, retrieve user from PasswordResetToken table
    // For now, this is a placeholder that should be called with proper user lookup
    throw new BadRequestException('密碼重設功能需要郵件服務整合');
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findOne(userId);
    const userWithPassword = await this.usersService.findByEmail(
      user.email || '',
    );

    if (!userWithPassword || !userWithPassword.password) {
      throw new UnauthorizedException('無法驗證目前的密碼');
    }

    const isPasswordValid = await this.passwordService.comparePasswords(
      oldPassword,
      userWithPassword.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('目前密碼不正確');
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);
    await this.usersService.update(userId, {
      password: hashedPassword,
    } as any);

    return { message: '密碼已成功變更' };
  }

  /**
   * Create admin session for group management
   * Session valid for 1 hour of inactivity
   */
  async createAdminSession(userId: string): Promise<{ sessionToken: string }> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('用戶不存在');
    }

    // Generate session token (short-lived for admin panel)
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // TODO: Store session in Redis with 1-hour TTL
    // sessionKey = `admin:${userId}:${sessionToken}`
    // ttl = 3600 seconds

    return { sessionToken };
  }

  /**
   * Verify admin session validity
   */
  async verifyAdminSession(userId: string, sessionToken: string): Promise<boolean> {
    // TODO: Check if session exists in Redis
    // if (!session) return false;
    // if (isExpired(session.expiresAt)) return false;

    // For now, accept valid format
    return /^[a-f0-9]{64}$/.test(sessionToken);
  }

  private generateTokens(
    userId: string,
    email: string | undefined,
    role: string,
  ): { access_token: string; refresh_token: string } {
    const payload = { sub: userId, email, role };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.access.secret'),
      expiresIn: '1h',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refresh.secret'),
      expiresIn: '10d',
    });

    return { access_token, refresh_token };
  }
}
