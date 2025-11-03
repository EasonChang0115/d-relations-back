import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';
import { AnswerRecord } from '@/modules/answers/entities/answer-record.entity';
import { ResultReport } from '@/modules/reports/entities/result-report.entity';
import { ExamType, ExamStatus, ExamVersion } from '@/common/constants';

@Entity('exams')
@Index('idx_user_id', ['userId'])
@Index('idx_status', ['status'])
@Index('idx_version', ['version'])
@Index('idx_session_id', ['sessionId'])
export class Exam extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'user_id', nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'session_id' })
  sessionId?: string;

  @Column({
    type: 'enum',
    enum: ExamType,
    name: 'exam_type',
  })
  examType!: ExamType;

  @Column({
    type: 'enum',
    enum: ExamVersion,
    default: ExamVersion.FREE,
  })
  version!: ExamVersion;

  @Column({
    type: 'enum',
    enum: ExamStatus,
    default: ExamStatus.NOT_STARTED,
  })
  status!: ExamStatus;

  @Column({ type: 'int', name: 'total_questions' })
  totalQuestions!: number;

  @Column({ type: 'int', default: 0, name: 'current_question' })
  currentQuestion!: number;

  @Column({ type: 'json', name: 'question_sequence' })
  questionSequence!: string[];

  @Column({ type: 'varchar', length: 64, nullable: true, name: 'random_seed' })
  randomSeed?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'payment_id' })
  paymentId?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'started_at' })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expiresAt?: Date;

  @Column({ type: 'int', nullable: true, name: 'time_spent_seconds' })
  timeSpentSeconds?: number;

  // Relations
  @ManyToOne(() => User, (user) => user.exams, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(() => AnswerRecord, (answer) => answer.exam)
  answers!: AnswerRecord[];

  @OneToMany(() => ResultReport, (report) => report.exam)
  reports!: ResultReport[];
}
