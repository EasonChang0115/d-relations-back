import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { GroupExamBatch } from './group-exam-batch.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Exam } from '@/modules/exams/entities/exam.entity';

export enum TakerStatus {
  INVITED = 'invited',
  STARTED = 'started',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

/**
 * Group Taker Entity
 * Represents a participant in a group exam batch
 * Tracks individual results and progress
 */
@Entity('group_takers')
@Index('idx_batch_id', ['batchId'])
@Index('idx_user_id', ['userId'])
@Index('idx_exam_id', ['examId'])
@Index('idx_status', ['status'])
export class GroupTaker extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'batch_id' })
  batchId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'user_id' })
  userId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'exam_id' })
  examId?: string;

  @Column({ type: 'varchar', length: 100, name: 'taker_name' })
  takerName!: string;

  @Column({ type: 'varchar', length: 255, name: 'taker_email' })
  takerEmail!: string;

  @Column({
    type: 'enum',
    enum: TakerStatus,
    default: TakerStatus.INVITED,
  })
  status!: TakerStatus;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'invitation_token' })
  invitationToken?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'invited_at' })
  invitedAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'started_at' })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  @Column({ type: 'int', nullable: true, name: 'correct_answers' })
  correctAnswers?: number;

  @Column({ type: 'int', nullable: true, name: 'total_questions' })
  totalQuestions?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'accuracy_rate' })
  accuracyRate?: number;

  @Column({ type: 'int', nullable: true, name: 'time_spent_seconds' })
  timeSpentSeconds?: number;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'ip_address' })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true, name: 'device_info' })
  deviceInfo?: string;

  // Relations
  @ManyToOne(() => GroupExamBatch, (batch) => batch.takers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_id' })
  batch!: GroupExamBatch;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Exam, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'exam_id' })
  exam?: Exam;
}
