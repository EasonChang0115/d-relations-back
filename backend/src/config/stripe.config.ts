import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  priceIds: {
    freeExam: process.env.STRIPE_FREE_EXAM_PRICE_ID,
    paidExam: process.env.STRIPE_PAID_EXAM_PRICE_ID,
    groupExam: process.env.STRIPE_GROUP_EXAM_PRICE_ID,
  },
  currency: 'twd',
  apiVersion: '2024-10-28.acacia' as const,
}));
