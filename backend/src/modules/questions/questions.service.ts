import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Question } from './entities/question.entity';
import { CellImage } from './entities/cell-image.entity';
import { ExamType } from '@/common/constants';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(CellImage)
    private readonly cellImageRepository: Repository<CellImage>,
  ) {}

  async findAll(): Promise<Question[]> {
    return await this.questionRepository.find({
      where: { isActive: true },
      relations: ['image'],
    });
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id, isActive: true },
      relations: ['image'],
    });

    if (!question) {
      throw new NotFoundException('題目不存在');
    }

    return question;
  }

  async findByExamType(examType: ExamType): Promise<Question[]> {
    return await this.questionRepository.find({
      where: { examType, isActive: true },
      relations: ['image'],
    });
  }

  async findRandomQuestions(examType: ExamType, count: number, seed?: string): Promise<Question[]> {
    const questions = await this.findByExamType(examType);

    if (questions.length < count) {
      throw new NotFoundException(`題庫不足，需要 ${count} 題，目前只有 ${questions.length} 題`);
    }

    // Use seed-based random if provided
    if (seed) {
      return this.seedBasedShuffle(questions, seed).slice(0, count);
    }

    // Otherwise use regular shuffle
    return this.shuffleArray(questions).slice(0, count);
  }

  async findByIds(ids: string[]): Promise<Question[]> {
    return await this.questionRepository.findBy({
      id: In(ids),
    });
  }

  // Seed-based random shuffle (deterministic)
  private seedBasedShuffle<T>(array: T[], seed: string): T[] {
    const arr = [...array];
    let hash = this.hashCode(seed);

    for (let i = arr.length - 1; i > 0; i--) {
      hash = (hash * 9301 + 49297) % 233280;
      const j = Math.floor((hash / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }

  // Simple hash function for seed
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Regular Fisher-Yates shuffle
  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Cell Image methods
  async findCellImage(id: string): Promise<CellImage> {
    const image = await this.cellImageRepository.findOne({
      where: { id, isActive: true },
    });

    if (!image) {
      throw new NotFoundException('圖片不存在');
    }

    return image;
  }

  async findCellImagesByCellType(cellType: string, examType: ExamType): Promise<CellImage[]> {
    return await this.cellImageRepository.find({
      where: { cellType, examType, isActive: true },
    });
  }
}
