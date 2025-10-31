import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST || 'localhost',
  port: parseInt(process.env.MAIL_PORT, 10) || 1025,
  secure: process.env.MAIL_PORT === '465',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  from: {
    name: process.env.MAIL_FROM_NAME || 'Medical Cell Test',
    address: process.env.MAIL_FROM || 'noreply@example.com',
  },
  pool: true,
  maxConnections: 5,
  rateDelta: 20000,
  rateLimit: 5,
}));
