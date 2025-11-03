import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { ReportResponseDto } from './dto/report-response.dto';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('reports')
@Controller('reports')
@Public()
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

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

  @Get(':id/pdf')
  @ApiOperation({ summary: '下載報表PDF' })
  @ApiResponse({ status: 200, description: 'PDF報表' })
  @ApiResponse({ status: 404, description: '報表不存在' })
  async getPdfReport(@Param('id') id: string): Promise<string> {
    // Get report to ensure it exists
    const report = await this.reportsService.findOne(id);
    
    // Generate PDF HTML (in production, convert to actual PDF)
    const pdfHtml = await this.pdfGenerator.generateResultPdf({
      userName: '使用者',
      examType: 'general',
      totalQuestions: report.totalQuestions,
      correctAnswers: report.correctAnswers,
      score: (report.correctAnswers / report.totalQuestions) * 100,
      completedAt: report.generatedAt,
      timeSpentSeconds: report.totalTimeSeconds,
    });

    return pdfHtml;
  }

  @Get(':id/recommendations')
  @ApiOperation({ summary: '取得推薦講座' })
  @ApiResponse({ status: 200, description: '推薦講座列表' })
  @ApiResponse({ status: 404, description: '報表不存在' })
  async getRecommendations(
    @Param('id') id: string,
  ): Promise<Array<{ id: string; title: string; cellType: string; duration: string }>> {
    return await this.reportsService.getRecommendedLectures(id);
  }

  @Get(':id/answer-distribution/:questionId')
  @ApiOperation({ summary: '取得答案分佈' })
  @ApiResponse({ status: 200, description: '答案分佈統計' })
  async getAnswerDistribution(
    @Param('questionId') questionId: string,
  ): Promise<any> {
    return await this.reportsService.getAnswerDistribution(questionId);
  }
}

