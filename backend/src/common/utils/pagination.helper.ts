import { PaginationDto } from '../dto/pagination.dto';

export class PaginationHelper {
  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static getTake(limit: number): number {
    return Math.min(limit, 100);
  }

  static calculatePages(totalItems: number, limit: number): number {
    return Math.ceil(totalItems / limit);
  }

  static getOffset(pagination: PaginationDto): { skip: number; take: number } {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;

    return {
      skip: this.getSkip(page, limit),
      take: this.getTake(limit),
    };
  }
}
