import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('sessions')
@Index('idx_user_id', ['userId'])
@Index('idx_token_hash', ['tokenHash'])
@Index('idx_expires_at', ['expiresAt'])
export class Session extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'user_id' })
  userId!: string;

  @Column({ type: 'varchar', length: 255, name: 'token_hash' })
  tokenHash!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'device_fingerprint' })
  deviceFingerprint?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'device_type' })
  deviceType?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'browser' })
  browser?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'ip_address' })
  ipAddress?: string;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'boolean', default: false, name: 'is_revoked' })
  isRevoked!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'revoked_at' })
  revokedAt?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'session_type' })
  sessionType?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
