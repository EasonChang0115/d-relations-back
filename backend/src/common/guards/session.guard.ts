import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface DeviceFingerprint {
  userAgent: string;
  ipAddress: string;
}

@Injectable()
export class SessionGuard implements CanActivate {
  private readonly sessionStorage = new Map<string, { expiresAt: number; deviceFp: DeviceFingerprint }>();

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Session not found');
    }

    const now = Date.now();
    const sessionExpiryTime = user.sessionExpiresAt;

    if (!sessionExpiryTime || now > sessionExpiryTime) {
      const loginUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/login`;
      throw new UnauthorizedException(`Session expired. Please login again: ${loginUrl}`);
    }

    const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
    if (now - user.sessionCreatedAt > tenDaysInMs) {
      const loginUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/login`;
      throw new UnauthorizedException(`Session expired. Please login again: ${loginUrl}`);
    }

    // Store session with device fingerprint for recovery
    const deviceFp = this.getDeviceFingerprint(request);
    const sessionKey = `${user.id}:${user.takerId || ''}`;
    this.sessionStorage.set(sessionKey, { expiresAt: sessionExpiryTime, deviceFp });

    return true;
  }

  /**
   * Recover session for same device/browser (same session cookie)
   */
  canRecoverSession(userId: string, takerId: string, deviceFp: DeviceFingerprint): boolean {
    const sessionKey = `${userId}:${takerId}`;
    const session = this.sessionStorage.get(sessionKey);

    if (!session) {
      return false;
    }

    if (Date.now() > session.expiresAt) {
      this.sessionStorage.delete(sessionKey);
      return false;
    }

    return this.compareDeviceFingerprints(session.deviceFp, deviceFp);
  }

  private getDeviceFingerprint(request: Request): DeviceFingerprint {
    return {
      userAgent: request.headers['user-agent'] || '',
      ipAddress: (request.ip || request.socket.remoteAddress || '').split(':').pop() || '',
    };
  }

  private compareDeviceFingerprints(fp1: DeviceFingerprint, fp2: DeviceFingerprint): boolean {
    return fp1.userAgent === fp2.userAgent && fp1.ipAddress === fp2.ipAddress;
  }
}
