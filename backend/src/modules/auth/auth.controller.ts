import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '使用者註冊' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: '註冊成功', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: '請求參數錯誤' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '使用者登入' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: '登入成功', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: '帳號或密碼錯誤' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: '使用者登出' })
  @ApiResponse({ status: 200, description: '登出成功' })
  @ApiResponse({ status: 401, description: '未授權' })
  async logout(@Request() req: any): Promise<{ message: string }> {
    await this.authService.logout(req.user.userId);
    return { message: '登出成功' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新存取令牌' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } 
      } 
    } 
  })
  @ApiResponse({ status: 200, description: '刷新成功', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Refresh Token 無效' })
  async refresh(
    @Body('refresh_token') refreshToken: string,
  ): Promise<AuthResponseDto> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh Token 不能為空');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取得當前使用者資訊' })
  @ApiResponse({ status: 200, description: '成功' })
  @ApiResponse({ status: 401, description: '未授權' })
  async getCurrentUser(@Request() req: any) {
    return req.user;
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '忘記密碼 - 發送重設郵件' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        email: { type: 'string', example: 'user@example.com' } 
      } 
    } 
  })
  @ApiResponse({ status: 200, description: '重設郵件已發送' })
  @ApiResponse({ status: 400, description: 'Email 格式錯誤' })
  async forgotPassword(@Body('email') email: string): Promise<{ message: string }> {
    if (!email) {
      throw new BadRequestException('Email 不能為空');
    }
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '重設密碼' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        reset_token: { type: 'string', example: 'reset_token_abc123' },
        new_password: { type: 'string', example: 'NewPassword123' }
      } 
    } 
  })
  @ApiResponse({ status: 200, description: '密碼重設成功' })
  @ApiResponse({ status: 400, description: 'Token 無效或已過期' })
  async resetPassword(
    @Body() body: { reset_token: string; new_password: string },
  ): Promise<{ message: string }> {
    if (!body.reset_token || !body.new_password) {
      throw new BadRequestException('Reset Token 和新密碼不能為空');
    }
    return this.authService.resetPassword(body.reset_token, body.new_password);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '變更密碼' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        old_password: { type: 'string', example: 'OldPassword123' },
        new_password: { type: 'string', example: 'NewPassword123' }
      } 
    } 
  })
  @ApiResponse({ status: 200, description: '密碼變更成功' })
  @ApiResponse({ status: 400, description: '舊密碼錯誤' })
  @ApiResponse({ status: 401, description: '未授權' })
  async changePassword(
    @Request() req: any,
    @Body() body: { old_password: string; new_password: string },
  ): Promise<{ message: string }> {
    if (!body.old_password || !body.new_password) {
      throw new BadRequestException('舊密碼和新密碼不能為空');
    }
    return this.authService.changePassword(
      req.user.userId,
      body.old_password,
      body.new_password,
    );
  }
}
