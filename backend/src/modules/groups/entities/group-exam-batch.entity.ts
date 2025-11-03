import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';
import { GroupTaker } from './group-taker.entity';

export enum BatchStatus {
  CREATED = 'created',
  CONFIGURED = 'configured',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

/**
 * Group Exam Batch Entity
 * Represents a batch of exams for a group of users
 * Admin can manage, monitor, and view results
 */
@Entity('group_exam_batches')
@Index('idx_admin_id', ['adminId'])
@Index('idx_status', ['status'])
@Index('idx_batch_token', ['batchToken'])
export class GroupExamBatch extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'admin_id' })
  adminId!: string;

  @Column({ type: 'varchar', length: 100, name: 'batch_name' })
  batchName!: string;

  @Column({ type: 'text', nullable: true, name: 'batch_description' })
  batchDescription?: string;

  @Column({
    type: 'enum',
    enum: BatchStatus,
    default: BatchStatus.CREATED,
  })
  status!: BatchStatus;

  @Column({ type: 'varchar', length: 255, name: 'exam_type' })
  examType!: string;

  @Column({ type: 'int', name: 'question_count' })
  questionCount!: number;

  @Column({ type: 'int', name: 'taker_count' })
  takerCount!: number;

  @Column({ type: 'int', default: 0, name: 'completed_count' })
  completedCount!: number;

  @Column({ type: 'json', nullable: true, name: 'question_sequence' })
  questionSequence?: string[];

  @Column({ type: 'varchar', length: 255, name: 'batch_token' })
  batchToken!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'admin_token' })
  adminToken?: string;

  @Column({ type: 'varchar', length: 64, nullable: true, name: 'batch_seed' })
  batchSeed?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'started_at' })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'view_expires_at' })
  viewExpiresAt?: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0, name: 'group_accuracy_rate' })
  groupAccuracyRate!: number;

  @Column({ type: 'int', default: 0, name: 'total_correct_answers' })
  totalCorrectAnswers!: number;

  @Column({ type: 'int', default: 0, name: 'total_questions_answered' })
  totalQuestionsAnswered!: number;

  // Relations
  @ManyToOne(() => User, (user) => user.groupBatches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  admin?: User;

  @OneToMany(() => GroupTaker, (taker) => taker.batch)
  takers!: GroupTaker[];
}
