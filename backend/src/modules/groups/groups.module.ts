import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './groups.controller';
import { GroupsService } from './services/groups.service';
import { GroupExamBatch } from './entities/group-exam-batch.entity';
import { GroupTaker } from './entities/group-taker.entity';
import { QuestionsModule } from '../questions/questions.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupExamBatch, GroupTaker]),
    QuestionsModule,
    MailModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
