import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('otp_verifications')
@Index('idx_user_id', ['userId'])
@Index('idx_otp_code', ['otpCode'])
@Index('idx_expires_at', ['expiresAt'])
export class OtpVerification extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'user_id' })
  userId!: string;

  @Column({ type: 'varchar', length: 6, name: 'otp_code' })
  otpCode!: string;

  @Column({ type: 'integer', default: 0, name: 'attempt_count' })
  attemptCount!: number;

  @Column({ type: 'integer', default: 10, name: 'max_attempts' })
  maxAttempts!: number;

  @Column({ type: 'boolean', default: false, name: 'is_locked' })
  isLocked!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'locked_until' })
  lockedUntil?: Date;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  isVerified!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'verified_at' })
  verifiedAt?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'verification_type' })
  verificationType?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
