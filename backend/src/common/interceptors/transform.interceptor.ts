import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dto/response.dto';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof ResponseDto) {
          return data;
        }

        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          return ResponseDto.successWithMeta(data.data, data.meta);
        }

        return ResponseDto.success(data);
      }),
    );
  }
}
