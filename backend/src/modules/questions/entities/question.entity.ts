import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { CellImage } from './cell-image.entity';
import { ExamType } from '@/common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('questions')
@Index('idx_exam_type', ['examType'])
@Index('idx_cell_type', ['cellType'])
export class Question extends BaseEntity {
  @ApiProperty({ 
    description: '測驗類型',
    enum: ExamType,
    example: 'peripheral_blood'
  })
  @Column({
    type: 'enum',
    enum: ExamType,
    name: 'exam_type',
  })
  examType!: ExamType;

  @ApiProperty({ 
    description: '細胞類型',
    example: 'neutrophil'
  })
  @Column({ type: 'varchar', length: 50, name: 'cell_type' })
  cellType!: string;

  @ApiProperty({ 
    description: '正確答案',
    example: 'A'
  })
  @Column({ type: 'varchar', length: 100, name: 'correct_answer' })
  correctAnswer!: string;

  @ApiProperty({ 
    description: '圖片 ID',
    example: 'img_abc123xyz'
  })
  @Column({ type: 'varchar', length: 255, name: 'image_id' })
  imageId!: string;

  @ApiPropertyOptional({ 
    description: '題目描述',
    example: '請辨識此細胞類型'
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ 
    description: '難度等級 (1-5)',
    example: 3,
    minimum: 1,
    maximum: 5
  })
  @Column({ type: 'int', default: 1 })
  difficulty!: number;

  @ApiProperty({ 
    description: '是否啟用',
    example: true
  })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @ApiPropertyOptional({ 
    description: '細胞圖片資訊',
    type: () => CellImage
  })
  @ManyToOne(() => CellImage, (cellImage) => cellImage.questions, { eager: true })
  @JoinColumn({ name: 'image_id', referencedColumnName: 'id' })
  image!: CellImage;
}
