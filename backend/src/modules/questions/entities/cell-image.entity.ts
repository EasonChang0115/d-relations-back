import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Question } from './question.entity';
import { ExamType } from '@/common/constants';

@Entity('cell_images')
@Index('idx_cell_type', ['cellType'])
@Index('idx_exam_type', ['examType'])
export class CellImage extends BaseEntity {
  @Column({ type: 'varchar', length: 50, name: 'cell_type' })
  cellType!: string;

  @Column({
    type: 'enum',
    enum: ExamType,
    name: 'exam_type',
  })
  examType!: ExamType;

  @Column({ type: 'varchar', length: 500, name: 'image_url' })
  imageUrl!: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'thumbnail_url' })
  thumbnailUrl?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'file_name' })
  fileName?: string;

  @Column({ type: 'int', nullable: true, name: 'file_size' })
  fileSize?: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'mime_type' })
  mimeType?: string;

  @Column({ type: 'int', nullable: true })
  width?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  // Relations
  @OneToMany(() => Question, (question) => question.image)
  questions!: Question[];
}
