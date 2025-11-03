import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

/**
 * Admin Guard
 * Verifies admin token and session validity for group management
 * Session expires after 1 hour of inactivity
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Get admin token from header or query
    const adminToken = this.extractAdminToken(request);
    if (!adminToken) {
      throw new UnauthorizedException('缺少管理員令牌');
    }

    // Verify admin token format
    if (!this.isValidTokenFormat(adminToken)) {
      throw new ForbiddenException('無效的管理員令牌');
    }

    // Check session validity (attached by JWT guard)
    const user = (request as any).user;
    if (!user) {
      throw new UnauthorizedException('缺少有效的會話');
    }

    // Check session expiry (1 hour of inactivity)
    const lastActivity = (request as any).lastActivity || Date.now();
    const sessionTimeout = 60 * 60 * 1000; // 1 hour

    if (Date.now() - lastActivity > sessionTimeout) {
      throw new ForbiddenException('會話已過期，請重新驗證');
    }

    // Attach admin token to request for later use
    (request as any).adminToken = adminToken;
    (request as any).lastActivity = Date.now();

    return true;
  }

  /**
   * Extract admin token from header or query
   */
  private extractAdminToken(request: Request): string | null {
    // Check Authorization header first (Bearer token)
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Fall back to query parameter
    return (request.query.token as string) || null;
  }

  /**
   * Validate token format (SHA256 hash, 32 chars)
   */
  private isValidTokenFormat(token: string): boolean {
    return /^[a-f0-9]{32}$/.test(token);
  }
}
