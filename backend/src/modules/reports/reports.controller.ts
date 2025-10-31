import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { ReportResponseDto } from './dto/report-response.dto';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('reports')
@Controller('reports')
@Public()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('exam/:examId')
  @ApiOperation({ summary: '生成測驗報表' })
  @ApiResponse({ status: 201, description: '報表已生成', type: ReportResponseDto })
  @ApiResponse({ status: 404, description: '測驗不存在' })
  async generateReport(@Param('examId') examId: string): Promise<ReportResponseDto> {
    return await this.reportsService.generateReport(examId);
  }

  @Get(':id')
  @ApiOperation({ summary: '取得報表' })
  @ApiResponse({ status: 200, description: '成功', type: ReportResponseDto })
  @ApiResponse({ status: 404, description: '報表不存在' })
  @ApiResponse({ status: 403, description: '報表已過期' })
  async getReport(@Param('id') id: string): Promise<ReportResponseDto> {
    return await this.reportsService.findOne(id);
  }

  @Get('exam/:examId')
  @ApiOperation({ summary: '取得測驗的報表' })
  @ApiResponse({ status: 200, description: '成功', type: ReportResponseDto })
  @ApiResponse({ status: 404, description: '報表不存在' })
  @ApiResponse({ status: 403, description: '報表已過期' })
  async getExamReport(@Param('examId') examId: string): Promise<ReportResponseDto> {
    return await this.reportsService.findByExamId(examId);
  }
}
