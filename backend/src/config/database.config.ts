import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'medical_cell_test',
    autoLoadEntities: true,
    synchronize: false, // 永遠設為 false，使用 migrations
    logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    charset: 'utf8mb4',
    timezone: '+08:00',
    extra: {
      connectionLimit: 10,
      connectTimeout: 60000,
    },
    poolSize: 10,
    maxQueryExecutionTime: 1000,
  }),
);
 