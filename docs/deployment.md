# Deployment Guide - 醫學細胞識別能力測驗平台

## Prerequisites

- Node.js 18 LTS or higher
- MySQL 8.0 or higher
- Redis 7.0 or higher
- AWS account (S3, SES)
- Stripe account
- Docker & Docker Compose (optional)

## Environment Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd speck-kit-demo/backend
npm install
```

### 2. Configure Environment Variables

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Fill in the required values:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=medical_cell_test

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=3600
REFRESH_TOKEN_EXPIRES_IN=864000

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_password
MAIL_FROM=noreply@medical-test.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=production
LOG_LEVEL=info
```

### 3. Database Setup

```bash
# Run migrations
npm run migration:run

# OR generate migrations from entities
npm run migration:generate -- migrations/Initial

# Run new migrations
npm run migration:run
```

## Docker Deployment

### Option 1: Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

Services started:
- MySQL (port 3306)
- Redis (port 6379)
- API (port 3000)

### Option 2: Manual Docker Build

```bash
# Build Docker image
docker build -t medical-test-api:1.0.0 .

# Run container
docker run -d \
  --name medical-test-api \
  -p 3000:3000 \
  --env-file .env \
  --network host \
  medical-test-api:1.0.0

# View logs
docker logs -f medical-test-api
```

## Production Build

### Build Optimization

```bash
# Clean previous builds
rm -rf dist/

# Build for production
npm run build

# Verify build
ls -la dist/
```

### Start Application

```bash
# Development
npm run start

# Production (watch mode)
npm run start:dev

# Debug mode
npm run start:debug
```

### Verify Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T06:34:08Z"
}
```

## Database Optimization

### 1. Create Indexes

```sql
-- User indexes
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_created_at ON users(created_at);

-- Exam indexes
CREATE INDEX idx_exam_user_id ON exams(user_id);
CREATE INDEX idx_exam_created_at ON exams(created_at);
CREATE INDEX idx_exam_status ON exams(status);
CREATE INDEX idx_exam_view_expires_at ON exams(view_expires_at);

-- Answer indexes
CREATE INDEX idx_answer_exam_id ON answers(exam_id);
CREATE INDEX idx_answer_question_id ON answers(question_id);

-- Payment indexes
CREATE INDEX idx_payment_user_id ON payments(user_id);
CREATE INDEX idx_payment_status ON payments(status);

-- Group indexes
CREATE INDEX idx_batch_user_id ON group_exam_batches(user_id);
CREATE INDEX idx_batch_created_at ON group_exam_batches(created_at);
CREATE INDEX idx_taker_batch_id ON group_takers(batch_id);
```

## Security Hardening

### 1. SSL/TLS Configuration

```bash
# Generate self-signed certificate (development)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Use proper certificate in production (Let's Encrypt)
```

### 2. Rate Limiting & OTP Lockout

- 100 API requests per 15 minutes per IP
- OTP lockout after 5 failed attempts (15 minutes)
- Session timeout: 10 days

### 3. Automatic Security Headers

- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

## Monitoring & Logging

### 1. Application Logs

Log levels: error, warn, info, debug (configured via LOG_LEVEL)

### 2. Health Check

```bash
GET /health
```

## Post-Deployment Verification

```bash
# Health check
curl http://localhost:3000/health

# Swagger API docs
http://localhost:3000/api-docs

# Test OTP endpoint
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"000000"}'
```

---

**Status**: Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2025-11-03
