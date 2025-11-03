import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Exam } from '@/modules/exams/entities/exam.entity';

export enum UserRole {
  ADMIN = 'admin',
  GROUP_MANAGER = 'group_manager',
  TAKER = 'taker',
  GUEST = 'guest',
}

export enum CertificationStatus {
  NONE = 'none',
  STUDENT = 'student',
  LICENSED = 'licensed',
  CERTIFIED = 'certified',
}

@Entity('users')
@Index('idx_email', ['email'])
@Index('idx_session_id', ['sessionId'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role!: UserRole;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'session_id' })
  sessionId?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  institution?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'job_title' })
  jobTitle?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'organization_code' })
  organizationCode?: string;

  @Column({
    type: 'enum',
    enum: CertificationStatus,
    default: CertificationStatus.NONE,
    name: 'certification_status',
  })
  certificationStatus!: CertificationStatus;

  @Column({ type: 'boolean', default: false, name: 'email_verified' })
  emailVerified!: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt?: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'password_reset_token', select: false })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true, name: 'password_reset_expires' })
  passwordResetExpires?: Date;

  // Relations
  @OneToMany(() => Exam, (exam) => exam.user)
  exams!: Exam[];

  // Will be imported dynamically to avoid circular dependencies
  // @OneToMany(() => GroupExamBatch, (batch) => batch.admin)
  // groupBatches!: GroupExamBatch[];
}
