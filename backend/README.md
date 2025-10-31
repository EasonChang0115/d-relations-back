# Medical Cell Test Backend API

醫學細胞識別能力測驗平台後端 API

## 技術棧

- **Framework**: NestJS 11.0
- **Language**: TypeScript 5.7
- **Database**: MySQL 8.0
- **ORM**: TypeORM 0.3
- **Cache**: Redis 7
- **Payment**: Stripe
- **Storage**: AWS S3
- **Mail**: AWS SES / Nodemailer
- **Documentation**: Swagger/OpenAPI

## 快速開始

### 先決條件

- Node.js 18+ LTS
- Docker & Docker Compose
- npm 或 yarn

### 安裝

1. 安裝依賴套件

```bash
npm install
```

2. 複製環境變數檔案

```bash
cp .env.example .env
```

3. 編輯 `.env` 檔案，設定你的環境變數

4. 啟動 Docker 服務 (MySQL + Redis)

```bash
docker-compose up -d
```

5. 執行資料庫遷移

```bash
npm run migration:run
```

6. (可選) 執行種子資料

```bash
npm run seed
```

### 開發

啟動開發伺服器 (hot-reload)：

```bash
npm run start:dev
```

API 將運行在 `http://localhost:3000`

Swagger 文檔: `http://localhost:3000/api/docs`

### 建置

建置生產版本：

```bash
npm run build
```

啟動生產伺服器：

```bash
npm run start:prod
```

## 開發工具

### Linting

```bash
npm run lint
```

### 格式化

```bash
npm run format
```

### 測試

```bash
# 單元測試
npm run test

# 測試覆蓋率
npm run test:cov

# E2E 測試
npm run test:e2e

# 監控模式
npm run test:watch
```

## 資料庫

### 遷移

建立新的遷移：

```bash
npm run migration:create -- src/database/migrations/YourMigrationName
```

自動生成遷移（基於實體變更）：

```bash
npm run migration:generate -- src/database/migrations/YourMigrationName
```

執行遷移：

```bash
npm run migration:run
```

回退遷移：

```bash
npm run migration:revert
```

## Docker

### 建置映像

```bash
docker build -t medical-cell-test-api .
```

### 運行容器

```bash
docker run -p 3000:3000 medical-cell-test-api
```

### Docker Compose

啟動所有服務：

```bash
docker-compose up -d
```

查看日誌：

```bash
docker-compose logs -f
```

停止服務：

```bash
docker-compose down
```

## 專案結構

```
src/
├── common/           # 共用功能
│   ├── decorators/   # 自定義裝飾器
│   ├── filters/      # 異常過濾器
│   ├── guards/       # 守衛
│   ├── interceptors/ # 攔截器
│   ├── middleware/   # 中間件
│   └── pipes/        # 管道
├── config/           # 配置
│   ├── app.config.ts
│   ├── database.config.ts
│   └── ...
├── modules/          # 功能模組
│   ├── auth/
│   ├── users/
│   ├── exams/
│   ├── questions/
│   └── ...
├── database/         # 資料庫
│   ├── migrations/   # 遷移檔案
│   └── seeds/        # 種子資料
├── utils/            # 工具函數
├── app.module.ts     # 根模組
└── main.ts           # 進入點
```

## API 端點

完整的 API 文檔請參考 Swagger: `http://localhost:3000/api/docs`

主要端點：

- `POST /api/auth/login` - 使用者登入
- `POST /api/exams/free/start` - 開始免費測驗
- `POST /api/exams/paid/purchase` - 購買付費測驗
- `GET /api/questions/:examId` - 取得測驗題目
- `POST /api/answers/:examId` - 提交答案
- `GET /api/reports/:examId` - 取得測驗報告

## 環境變數

請參考 `.env.example` 檔案了解所有必需的環境變數。

重要的環境變數：

- `NODE_ENV` - 環境 (development/production)
- `PORT` - API 伺服器埠號
- `DB_*` - 資料庫連接設定
- `JWT_*` - JWT 設定
- `AWS_*` - AWS S3 設定
- `STRIPE_*` - Stripe 付款設定

## 授權

MIT

## 支援

如有問題，請參考專案文檔或聯繫開發團隊。
