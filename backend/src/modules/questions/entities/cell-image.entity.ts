import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Question } from './question.entity';
import { ExamType } from '@/common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('cell_images')
@Index('idx_cell_type', ['cellType'])
@Index('idx_exam_type', ['examType'])
export class CellImage extends BaseEntity {
  @ApiProperty({ 
    description: '細胞類型',
    example: 'neutrophil'
  })
  @Column({ type: 'varchar', length: 50, name: 'cell_type' })
  cellType!: string;

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
    description: '圖片 URL',
    example: 'https://storage.example.com/images/cell_001.jpg'
  })
  @Column({ type: 'varchar', length: 500, name: 'image_url' })
  imageUrl!: string;

  @ApiPropertyOptional({ 
    description: '縮圖 URL',
    example: 'https://storage.example.com/thumbnails/cell_001_thumb.jpg'
  })
  @Column({ type: 'varchar', length: 500, nullable: true, name: 'thumbnail_url' })
  thumbnailUrl?: string;

  @ApiPropertyOptional({ 
    description: '檔案名稱',
    example: 'cell_001.jpg'
  })
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'file_name' })
  fileName?: string;

  @ApiPropertyOptional({ 
    description: '檔案大小 (bytes)',
    example: 524288
  })
  @Column({ type: 'int', nullable: true, name: 'file_size' })
  fileSize?: number;

  @ApiPropertyOptional({ 
    description: 'MIME 類型',
    example: 'image/jpeg'
  })
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'mime_type' })
  mimeType?: string;

  @ApiPropertyOptional({ 
    description: '圖片寬度 (px)',
    example: 1920
  })
  @Column({ type: 'int', nullable: true })
  width?: number;

  @ApiPropertyOptional({ 
    description: '圖片高度 (px)',
    example: 1080
  })
  @Column({ type: 'int', nullable: true })
  height?: number;

  @ApiPropertyOptional({ 
    description: '圖片描述',
    example: '嗜中性球細胞圖片'
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ 
    description: '是否啟用',
    example: true
  })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @ApiPropertyOptional({ 
    description: '關聯的題目',
    type: () => [Question]
  })
  @OneToMany(() => Question, (question) => question.image)
  questions!: Question[];
}
