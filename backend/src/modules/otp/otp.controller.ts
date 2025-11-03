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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Public()
  @Post('send')
  @HttpCode(HttpStatus.OK)
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
