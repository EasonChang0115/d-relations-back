import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './services/groups.service';
import {
  CreateBatchDto,
  ConfigureTakersDto,
  BatchResponseDto,
  BatchStatusDto,
} from './dto/batch.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('batches')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: '建立群組測驗批次',
    description: '建立一個新的群組測驗批次，用於多人測驗管理'
  })
  @ApiResponse({ 
    status: 201, 
    description: '批次已建立', 
    type: BatchResponseDto,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      batchName: '2024 春季測驗',
      batchDescription: '春季新人培訓測驗',
      status: 'draft',
      examType: 'peripheral_blood',
      questionCount: 30,
      takerCount: 20,
      completedCount: 0,
      groupAccuracyRate: 0,
      adminToken: 'admin_token_abc123',
      batchToken: 'batch_token_xyz789',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    }
  })
  @ApiResponse({ status: 400, description: '參數錯誤' })
  @ApiResponse({ status: 401, description: '未授權' })
  async createBatch(
    @CurrentUser() user: any,
    @Body() createBatchDto: CreateBatchDto,
  ): Promise<BatchResponseDto> {
    return await this.groupsService.createBatch(user.id, createBatchDto);
  }

  @Post('batches/:id/configure')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: '設定批次受測者',
    description: '為批次添加受測者清單並發送邀請通知'
  })
  @ApiResponse({ status: 200, description: '設定完成', type: BatchResponseDto })
  @ApiResponse({ status: 404, description: '批次不存在' })
  @ApiResponse({ status: 403, description: '無權限' })
  @ApiResponse({ status: 401, description: '未授權' })
  async configureTakers(
    @CurrentUser() user: any,
    @Param('id') batchId: string,
    @Body() configureTakersDto: ConfigureTakersDto,
  ): Promise<BatchResponseDto> {
    return await this.groupsService.configureTakers(batchId, user.id, configureTakersDto);
  }

  @Get('batches/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: '取得批次狀態',
    description: '查詢批次的進度、受測者狀態和統計資訊'
  })
  @ApiResponse({ 
    status: 200, 
    description: '成功', 
    type: BatchStatusDto,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      batchName: '2024 春季測驗',
      status: 'active',
      takerCount: 20,
      completedCount: 5,
      groupAccuracyRate: 85.5,
      takers: []
    }
  })
  @ApiResponse({ status: 404, description: '批次不存在' })
  @ApiResponse({ status: 403, description: '無權限' })
  @ApiResponse({ status: 401, description: '未授權' })
  async getBatchStatus(
    @CurrentUser() user: any,
    @Param('id') batchId: string,
  ): Promise<BatchStatusDto> {
    return await this.groupsService.getBatchStatus(batchId, user.id);
  }
}
