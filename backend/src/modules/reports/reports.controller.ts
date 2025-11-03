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
  @ApiOperation({ 
    summary: '生成測驗報表',
    description: '根據測驗結果生成完整的統計報表'
  })
  @ApiResponse({ 
    status: 201, 
    description: '報表已生成', 
    type: ReportResponseDto
  })
  @ApiResponse({ status: 404, description: '測驗不存在' })
  async generateReport(@Param('examId') examId: string): Promise<ReportResponseDto> {
    return await this.reportsService.generateReport(examId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: '取得報表',
    description: '取得指定 ID 的報表詳細資訊'
  })
  @ApiResponse({ status: 200, description: '成功', type: ReportResponseDto })
  @ApiResponse({ status: 404, description: '報表不存在' })
  @ApiResponse({ status: 403, description: '報表已過期' })
  async getReport(@Param('id') id: string): Promise<ReportResponseDto> {
    return await this.reportsService.findOne(id);
  }

  @Get('exam/:examId')
  @ApiOperation({ 
    summary: '取得測驗的報表',
    description: '根據測驗 ID 取得對應的報表'
  })
  @ApiResponse({ status: 200, description: '成功', type: ReportResponseDto })
  @ApiResponse({ status: 404, description: '報表不存在' })
  @ApiResponse({ status: 403, description: '報表已過期' })
  async getExamReport(@Param('examId') examId: string): Promise<ReportResponseDto> {
    return await this.reportsService.findByExamId(examId);
  }

  @Get(':id/pdf')
  @ApiOperation({ 
    summary: '下載報表 PDF',
    description: '產生並下載報表的 PDF 檔案'
  })
  @ApiResponse({ status: 200, description: 'PDF 報表' })
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
  @ApiOperation({ 
    summary: '取得推薦講座',
    description: '根據測驗結果推薦相關的學習講座'
  })
  @ApiResponse({ 
    status: 200, 
    description: '推薦講座列表',
    example: [
      {
        id: 'lecture_001',
        title: '嗜中性球辨識技巧',
        cellType: 'neutrophil',
        duration: '30 分鐘'
      }
    ]
  })
  @ApiResponse({ status: 404, description: '報表不存在' })
  async getRecommendations(
    @Param('id') id: string,
  ): Promise<Array<{ id: string; title: string; cellType: string; duration: string }>> {
    return await this.reportsService.getRecommendedLectures(id);
  }

  @Get(':id/answer-distribution/:questionId')
  @ApiOperation({ 
    summary: '取得答案分佈',
    description: '查詢特定題目的答案選擇分佈統計'
  })
  @ApiResponse({ 
    status: 200, 
    description: '答案分佈統計',
    example: {
      questionId: '123e4567-e89b-12d3-a456-426614174000',
      totalAnswers: 100,
      distribution: {
        A: 25,
        B: 45,
        C: 20,
        D: 10
      }
    }
  })
  async getAnswerDistribution(
    @Param('questionId') questionId: string,
  ): Promise<any> {
    return await this.reportsService.getAnswerDistribution(questionId);
  }
}

