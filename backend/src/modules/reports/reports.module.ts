import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { PdfTemplateBuilder } from './services/pdf-template.builder';
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
  providers: [ReportsService, PdfGeneratorService, PdfTemplateBuilder],
  exports: [ReportsService, PdfGeneratorService],
})
export class ReportsModule {}
