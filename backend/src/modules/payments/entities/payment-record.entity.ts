import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('payment_records')
@Index('idx_user_id', ['userId'])
@Index('idx_stripe_payment_id', ['stripePaymentId'])
@Index('idx_created_at', ['createdAt'])
export class PaymentRecord extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'user_id' })
  userId!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 3, default: 'TWD' })
  currency!: string;

  @Column({ type: 'varchar', length: 255, name: 'stripe_payment_id' })
  stripePaymentId!: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'varchar', length: 50, name: 'payment_method' })
  paymentMethod!: string;

  @Column({ type: 'text', nullable: true, name: 'stripe_response' })
  stripeResponse?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'receipt_url' })
  receiptUrl?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  @Column({ type: 'text', nullable: true, name: 'failure_reason' })
  failureReason?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'exam_type' })
  examType?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
