import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CellImage } from './entities/cell-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, CellImage])],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
