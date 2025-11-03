import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './groups.controller';
import { GroupExamTakerController } from './group-exam-taker.controller';
import { GroupsService } from './services/groups.service';
import { GroupExamBatch } from './entities/group-exam-batch.entity';
import { GroupTaker } from './entities/group-taker.entity';
import { QuestionsModule } from '../questions/questions.module';
import { MailModule } from '../mail/mail.module';
import { ExamsModule } from '../exams/exams.module';
import { AnswersModule } from '../answers/answers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupExamBatch, GroupTaker]),
    QuestionsModule,
    MailModule,
    ExamsModule,
    AnswersModule,
  ],
  controllers: [GroupsController, GroupExamTakerController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
