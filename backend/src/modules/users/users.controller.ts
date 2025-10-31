import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取得當前使用者資料' })
  @ApiResponse({ status: 200, description: '成功', type: UserResponseDto })
  async getProfile(@CurrentUser('userId') userId: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新使用者資料' })
  @ApiResponse({ status: 200, description: '成功', type: UserResponseDto })
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '取得使用者資料' })
  @ApiResponse({ status: 200, description: '成功', type: UserResponseDto })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }
}
