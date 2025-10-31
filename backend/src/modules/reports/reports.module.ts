import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ResultReport } from './entities/result-report.entity';
import { ExamsModule } from '../exams/exams.module';
import { AnswersModule } from '../answers/answers.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResultReport]),
    ExamsModule,
    AnswersModule,
    QuestionsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
