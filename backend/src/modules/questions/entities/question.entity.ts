import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { CellImage } from './cell-image.entity';
import { ExamType } from '@/common/constants';

@Entity('questions')
@Index('idx_exam_type', ['examType'])
@Index('idx_cell_type', ['cellType'])
export class Question extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ExamType,
    name: 'exam_type',
  })
  examType: ExamType;

  @Column({ type: 'varchar', length: 50, name: 'cell_type' })
  cellType: string;

  @Column({ type: 'varchar', length: 100, name: 'correct_answer' })
  correctAnswer: string;

  @Column({ type: 'varchar', length: 255, name: 'image_id' })
  imageId: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 1 })
  difficulty: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  // Relation
  @ManyToOne(() => CellImage, (cellImage) => cellImage.questions, { eager: true })
  @JoinColumn({ name: 'image_id', referencedColumnName: 'id' })
  image: CellImage;
}
