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
  @ApiOperation({ summary: '開始新測驗' })
  @ApiResponse({ status: 201, description: '測驗已建立', type: ExamResponseDto })
  @ApiResponse({ status: 400, description: '請求參數錯誤' })
  async startExam(@Body() startExamDto: StartExamDto): Promise<ExamResponseDto> {
    return await this.examsService.startExam(startExamDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '取得測驗資訊' })
  @ApiResponse({ status: 200, description: '成功', type: ExamResponseDto })
  @ApiResponse({ status: 404, description: '測驗不存在' })
  async getExam(@Param('id') id: string): Promise<ExamResponseDto> {
    const exam = await this.examsService.findOne(id);
    return new ExamResponseDto(exam);
  }

  @Get(':id/current')
  @ApiOperation({ summary: '取得當前題目' })
  @ApiResponse({ status: 200, description: '成功', type: CurrentQuestionResponseDto })
  @ApiResponse({ status: 404, description: '測驗或題目不存在' })
  @ApiResponse({ status: 403, description: '測驗已過期' })
  async getCurrentQuestion(@Param('id') id: string): Promise<CurrentQuestionResponseDto> {
    return await this.examsService.getCurrentQuestion(id);
  }
}
