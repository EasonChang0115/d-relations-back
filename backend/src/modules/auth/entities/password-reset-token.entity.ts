import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/users/entities/user.entity';

@Entity('password_reset_tokens')
@Index('idx_user_id', ['userId'])
@Index('idx_token_hash', ['tokenHash'])
export class PasswordResetToken extends BaseEntity {
  @Column({ type: 'varchar', length: 255, name: 'user_id' })
  userId!: string;

  @Column({ type: 'varchar', length: 255, name: 'token_hash' })
  tokenHash!: string;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;

  @Column({ type: 'boolean', default: false, name: 'used' })
  used!: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
