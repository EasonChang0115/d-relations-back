import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('questions')
@Controller('questions')
@Public()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({ summary: '取得所有題目' })
  @ApiResponse({ status: 200, description: '成功', type: [Question] })
  async findAll(): Promise<Question[]> {
    return await this.questionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '取得單一題目' })
  @ApiResponse({ status: 200, description: '成功', type: Question })
  @ApiResponse({ status: 404, description: '題目不存在' })
  async findOne(@Param('id') id: string): Promise<Question> {
    return await this.questionsService.findOne(id);
  }

  @Get('type/:examType')
  @ApiOperation({ summary: '按測驗類型取得題目' })
  @ApiResponse({ status: 200, description: '成功', type: [Question] })
  async findByExamType(@Param('examType') examType: string): Promise<Question[]> {
    return await this.questionsService.findByExamType(examType as any);
  }
}
