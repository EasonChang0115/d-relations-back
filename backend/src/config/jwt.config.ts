import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  access: {
    secret: process.env.JWT_ACCESS_SECRET || 'your-access-token-secret-here',
    expiresIn: process.env.JWT_ACCESS_EXPIRATION || '1h',
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret-here',
    expiresIn: process.env.JWT_REFRESH_EXPIRATION || '10d',
  },
}));
