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
  @ApiOperation({ 
    summary: '取得所有題目',
    description: '取得題庫中的所有題目 (管理用途)'
  })
  @ApiResponse({ 
    status: 200, 
    description: '成功', 
    type: [Question]
  })
  async findAll(): Promise<Question[]> {
    return await this.questionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: '取得單一題目',
    description: '根據題目 ID 取得題目詳細資料'
  })
  @ApiResponse({ status: 200, description: '成功', type: Question })
  @ApiResponse({ status: 404, description: '題目不存在' })
  async findOne(@Param('id') id: string): Promise<Question> {
    return await this.questionsService.findOne(id);
  }

  @Get('type/:examType')
  @ApiOperation({ 
    summary: '按測驗類型取得題目',
    description: '取得指定測驗類型的所有題目'
  })
  @ApiResponse({ 
    status: 200, 
    description: '成功', 
    type: [Question],
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        examType: 'peripheral_blood',
        cellType: 'neutrophil',
        cellTypeName: '嗜中性球',
        imageUrl: 'https://storage.example.com/images/cell_001.jpg',
        correctAnswer: 'A'
      }
    ]
  })
  async findByExamType(@Param('examType') examType: string): Promise<Question[]> {
    return await this.questionsService.findByExamType(examType as any);
  }
}
