import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { SendOtpDto, VerifyOtpDto } from './dto/send-otp.dto';
import { Public } from '@/common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Public()
  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: '發送 OTP 驗證碼',
    description: '發送 6 位數字驗證碼到指定 Email'
  })
  @ApiBody({ type: SendOtpDto })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP 已發送',
    example: {
      message: 'OTP 已發送到您的信箱',
      expiresIn: '5 分鐘'
    }
  })
  @ApiResponse({ status: 400, description: 'Email 格式錯誤' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<{ message: string; expiresIn: string }> {
    if (!sendOtpDto.email) {
      throw new BadRequestException('Email 不能為空');
    }
    return this.otpService.sendOtp(
      sendOtpDto.email,
      sendOtpDto.verificationType || 'email_verification',
    );
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: '驗證 OTP',
    description: '驗證使用者輸入的 6 位數字驗證碼'
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ 
    status: 200, 
    description: 'OTP 驗證成功',
    example: {
      message: 'OTP 驗證成功',
      sessionToken: 'session_abc123xyz'
    }
  })
  @ApiResponse({ status: 400, description: '驗證碼錯誤或已過期' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{ message: string; sessionToken?: string }> {
    if (!verifyOtpDto.email || !verifyOtpDto.otpCode) {
      throw new BadRequestException('Email 和驗證碼不能為空');
    }
    if (verifyOtpDto.otpCode.length !== 6) {
      throw new BadRequestException('驗證碼長度必須為 6 位');
    }
    return this.otpService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otpCode);
  }
}
