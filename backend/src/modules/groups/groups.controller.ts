import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './services/groups.service';
import { CreateBatchDto, ConfigureTakersDto, BatchResponseDto, BatchStatusDto } from './dto/batch.dto';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('batches')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '建立群組測驗批次' })
  @ApiResponse({ status: 201, description: '批次已建立', type: BatchResponseDto })
  @ApiResponse({ status: 400, description: '參數錯誤' })
  async createBatch(
    @CurrentUser() user: any,
    @Body() createBatchDto: CreateBatchDto,
  ): Promise<BatchResponseDto> {
    return await this.groupsService.createBatch(user.id, createBatchDto);
  }

  @Post('batches/:id/configure')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '設定批次受測者' })
  @ApiResponse({ status: 200, description: '設定完成', type: BatchStatusDto })
  @ApiResponse({ status: 404, description: '批次不存在' })
  @ApiResponse({ status: 403, description: '無權限' })
  async configureTakers(
    @CurrentUser() user: any,
    @Param('id') batchId: string,
    @Body() configureTakersDto: ConfigureTakersDto,
  ): Promise<BatchStatusDto> {
    return await this.groupsService.configureTakers(batchId, user.id, configureTakersDto);
  }

  @Get('batches/:id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '取得批次狀態' })
  @ApiResponse({ status: 200, description: '成功', type: BatchStatusDto })
  @ApiResponse({ status: 404, description: '批次不存在' })
  @ApiResponse({ status: 403, description: '無權限' })
  async getBatchStatus(
    @CurrentUser() user: any,
    @Param('id') batchId: string,
  ): Promise<BatchStatusDto> {
    return await this.groupsService.getBatchStatus(batchId, user.id);
  }
}
