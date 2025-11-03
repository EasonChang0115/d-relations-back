import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { StartExamDto } from './dto/start-exam.dto';
import { ExamResponseDto, CurrentQuestionResponseDto } from './dto/exam-response.dto';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('exams')
@Controller('exams')
@Public()
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('start')
  @ApiOperation({ 
    summary: '開始新測驗',
    description: '建立一個新的測驗，返回測驗 ID 和第一題資訊'
  })
  @ApiResponse({ 
    status: 201, 
    description: '測驗已建立', 
    type: ExamResponseDto,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      examType: 'peripheral_blood',
      version: 'free',
      status: 'in_progress',
      totalQuestions: 30,
      currentQuestion: 0,
      startedAt: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  })
  @ApiResponse({ status: 400, description: '請求參數錯誤' })
  async startExam(@Body() startExamDto: StartExamDto): Promise<ExamResponseDto> {
    return await this.examsService.startExam(startExamDto);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: '取得測驗資訊',
    description: '取得指定測驗的詳細資訊和進度'
  })
  @ApiResponse({ status: 200, description: '成功', type: ExamResponseDto })
  @ApiResponse({ status: 404, description: '測驗不存在' })
  async getExam(@Param('id') id: string): Promise<ExamResponseDto> {
    const exam = await this.examsService.findOne(id);
    return new ExamResponseDto(exam);
  }

  @Get(':id/current')
  @ApiOperation({ 
    summary: '取得當前題目',
    description: '取得測驗中當前應該作答的題目資訊和圖片'
  })
  @ApiResponse({ 
    status: 200, 
    description: '成功', 
    type: CurrentQuestionResponseDto,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      currentQuestion: 0,
      totalQuestions: 30,
      currentQuestionData: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        order: 1,
        imageUrl: 'https://storage.example.com/images/cell_001.jpg',
        thumbnailUrl: 'https://storage.example.com/thumbnails/cell_001_thumb.jpg',
        description: '請辨識此細胞類型'
      }
    }
  })
  @ApiResponse({ status: 404, description: '測驗或題目不存在' })
  @ApiResponse({ status: 403, description: '測驗已過期' })
  async getCurrentQuestion(@Param('id') id: string): Promise<CurrentQuestionResponseDto> {
    return await this.examsService.getCurrentQuestion(id);
  }
}
