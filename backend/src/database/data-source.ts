import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { register } from 'tsconfig-paths';
import { join } from 'path';

// Register tsconfig paths for TypeORM CLI
register({
  baseUrl: join(__dirname, '../..'),
  paths: {
    '@/*': ['src/*'],
    '@common/*': ['src/common/*'],
    '@config/*': ['src/config/*'],
    '@modules/*': ['src/modules/*'],
    '@utils/*': ['src/utils/*'],
  },
});

config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'medical_cell_test',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  charset: 'utf8mb4',
  timezone: '+08:00',
});
