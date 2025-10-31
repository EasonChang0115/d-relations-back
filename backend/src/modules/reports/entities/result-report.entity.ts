import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Exam } from '@/modules/exams/entities/exam.entity';

@Entity('result_reports')
@Index('idx_exam_id', ['examId'])
@Index('idx_expires_at', ['expiresAt'])
export class ResultReport extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'exam_id' })
  examId: string;

  @Column({ type: 'int', name: 'total_questions' })
  totalQuestions: number;

  @Column({ type: 'int', name: 'correct_answers' })
  correctAnswers: number;

  @Column({ type: 'int', name: 'wrong_answers' })
  wrongAnswers: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'accuracy_rate' })
  accuracyRate: number;

  @Column({ type: 'int', nullable: true, name: 'total_time_seconds' })
  totalTimeSeconds?: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true, name: 'avg_time_per_question' })
  avgTimePerQuestion?: number;

  @Column({ type: 'json', nullable: true, name: 'cell_type_stats' })
  cellTypeStats?: Record<string, any>;

  @Column({ type: 'timestamp', name: 'generated_at' })
  generatedAt: Date;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false, name: 'is_expired' })
  isExpired: boolean;

  // Relations
  @ManyToOne(() => Exam, (exam) => exam.reports)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;
}
