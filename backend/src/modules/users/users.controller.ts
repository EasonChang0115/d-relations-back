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
  @ApiOperation({ 
    summary: '取得當前使用者資料',
    description: '取得目前登入使用者的完整個人資料'
  })
  @ApiResponse({ status: 200, description: '成功', type: UserResponseDto })
  @ApiResponse({ status: 401, description: '未授權' })
  async getProfile(@CurrentUser('userId') userId: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: '更新使用者資料',
    description: '更新目前登入使用者的個人資料'
  })
  @ApiResponse({ status: 200, description: '成功', type: UserResponseDto })
  @ApiResponse({ status: 400, description: '參數錯誤' })
  @ApiResponse({ status: 401, description: '未授權' })
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ 
    summary: '取得使用者資料',
    description: '根據使用者 ID 取得使用者的公開資料'
  })
  @ApiResponse({ status: 200, description: '成功', type: UserResponseDto })
  @ApiResponse({ status: 404, description: '使用者不存在' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }
}
