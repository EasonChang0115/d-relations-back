import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Exam } from '@/modules/exams/entities/exam.entity';
import { Question } from '@/modules/questions/entities/question.entity';

@Entity('answer_records')
@Index('idx_exam_id', ['examId'])
@Index('idx_question_id', ['questionId'])
@Index('idx_is_correct', ['isCorrect'])
export class AnswerRecord extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'exam_id' })
  examId!: string;

  @Column({ type: 'varchar', length: 255, name: 'question_id' })
  questionId!: string;

  @Column({ type: 'int', name: 'question_order' })
  questionOrder!: number;

  @Column({ type: 'varchar', length: 100, name: 'user_answer' })
  userAnswer!: string;

  @Column({ type: 'varchar', length: 100, name: 'correct_answer' })
  correctAnswer!: string;

  @Column({ type: 'boolean', name: 'is_correct' })
  isCorrect!: boolean;

  @Column({ type: 'int', nullable: true, name: 'time_spent_seconds' })
  timeSpentSeconds?: number;

  @Column({ type: 'timestamp', name: 'answered_at' })
  answeredAt!: Date;

  // Relations
  @ManyToOne(() => Exam, (exam) => exam.answers)
  @JoinColumn({ name: 'exam_id' })
  exam!: Exam;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question!: Question;
}
