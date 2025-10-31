import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { AnswerRecord } from './entities/answer-record.entity';
import { ExamsModule } from '../exams/exams.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerRecord]),
    forwardRef(() => ExamsModule),
    QuestionsModule,
  ],
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [AnswersService],
})
export class AnswersModule {}
