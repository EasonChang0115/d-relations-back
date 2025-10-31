# 🚀 快速開始指南

## 前置需求

- Node.js 18+ 
- Docker & Docker Compose
- MySQL 8.0
- Redis 7.0

## 安裝步驟

### 1. 安裝依賴

```bash
cd backend

# 如果遇到 npm cache 權限問題
sudo chown -R $(whoami) ~/.npm

# 安裝依賴
npm install
```

### 2. 環境設定

```bash
# 複製環境變數範本
cp .env.example .env

# 編輯 .env 檔案，至少設定以下項目：
# DB_PASSWORD=your_secure_password
# JWT_ACCESS_SECRET=your_jwt_secret
# JWT_REFRESH_SECRET=your_refresh_secret
```

### 3. 啟動資料庫服務

```bash
# 啟動 MySQL 和 Redis
docker-compose up -d

# 查看服務狀態
docker-compose ps

# 查看 MySQL 日誌
docker-compose logs -f mysql
```

### 4. 執行資料庫遷移

```bash
# 執行遷移 (將來有 migration 檔案後使用)
npm run migration:run

# 回滾遷移
npm run migration:revert

# 查看遷移狀態
npm run migration:show
```

### 5. 啟動開發伺服器

```bash
# 開發模式 (熱重載)
npm run start:dev

# 一般模式
npm run start

# 除錯模式
npm run start:debug
```

### 6. 訪問應用程式

- **API 根路徑**: http://localhost:3000/api
- **Swagger 文檔**: http://localhost:3000/api/docs
- **健康檢查**: http://localhost:3000/api/health

## 常用命令

### 開發

```bash
# 格式化程式碼
npm run format

# 檢查程式碼風格
npm run lint

# 自動修復 lint 問題
npm run lint:fix

# 編譯專案
npm run build
```

### 測試

```bash
# 單元測試
npm run test

# 測試覆蓋率
npm run test:cov

# E2E 測試
npm run test:e2e

# 監聽模式
npm run test:watch
```

### 資料庫

```bash
# 產生新的遷移檔案
npm run migration:generate -- -n CreateUserTable

# 建立空白遷移檔案
npm run migration:create -- -n AddIndexes

# 執行遷移
npm run migration:run

# 回滾最後一次遷移
npm run migration:revert

# 執行種子資料 (將來實作)
npm run seed
```

### Docker

```bash
# 啟動所有服務
docker-compose up -d

# 停止所有服務
docker-compose down

# 重建並啟動
docker-compose up -d --build

# 查看日誌
docker-compose logs -f [service_name]

# 進入 MySQL 容器
docker-compose exec mysql mysql -u root -p

# 進入 Redis 容器
docker-compose exec redis redis-cli
```

## 專案結構

```
backend/
├── src/
│   ├── config/          # 配置檔案
│   ├── common/          # 共用模組
│   │   ├── constants/   # 常數定義
│   │   ├── decorators/  # 自訂裝飾器
│   │   ├── dto/         # 共用 DTO
│   │   ├── entities/    # 基礎實體
│   │   ├── filters/     # 例外過濾器
│   │   ├── guards/      # 守衛
│   │   ├── interceptors/# 攔截器
│   │   ├── interfaces/  # 介面
│   │   ├── pipes/       # 管道
│   │   └── utils/       # 工具
│   ├── database/        # 資料庫
│   │   ├── migrations/  # 遷移檔案
│   │   └── seeds/       # 種子資料
│   ├── modules/         # 功能模組
│   │   └── auth/        # 認證模組
│   ├── app.module.ts    # 根模組
│   └── main.ts          # 進入點
├── test/                # 測試檔案
├── docker/              # Docker 相關
├── .env.example         # 環境變數範本
├── docker-compose.yml   # Docker Compose 配置
├── package.json         # 依賴管理
└── tsconfig.json        # TypeScript 配置
```

## API 使用範例

### 健康檢查

```bash
curl http://localhost:3000/api/health
```

回應：
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "status": "ok",
    "timestamp": "2025-10-31T12:00:00.000Z",
    "uptime": 123.456,
    "environment": "development",
    "version": "1.0.0"
  },
  "timestamp": "2025-10-31T12:00:00.000Z"
}
```

## 環境變數說明

### 必要設定
- `DB_PASSWORD` - MySQL 密碼
- `JWT_ACCESS_SECRET` - JWT Access Token 密鑰
- `JWT_REFRESH_SECRET` - JWT Refresh Token 密鑰

### 可選設定
- `NODE_ENV` - 環境 (development/production)
- `PORT` - 伺服器埠號 (預設: 3000)
- `DB_HOST` - MySQL 主機 (預設: localhost)
- `DB_PORT` - MySQL 埠號 (預設: 3306)
- `REDIS_HOST` - Redis 主機 (預設: localhost)
- `REDIS_PORT` - Redis 埠號 (預設: 6379)

完整環境變數列表請參考 `.env.example`

## 常見問題

### 1. npm install 權限錯誤

```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
npm install
```

### 2. Docker 容器無法啟動

```bash
# 清理舊容器
docker-compose down -v

# 重新啟動
docker-compose up -d
```

### 3. 資料庫連接失敗

檢查 `.env` 檔案中的資料庫設定，確保 Docker 容器已啟動：
```bash
docker-compose ps
```

### 4. TypeScript 編譯錯誤

```bash
# 清理編譯檔案
rm -rf dist

# 重新編譯
npm run build
```

## 下一步

1. **執行 npm install** 安裝所有依賴
2. **啟動 Docker 服務** 準備資料庫環境
3. **開始開發 Phase 4** 實作免費版測驗功能

需要更多資訊請參考：
- `PHASE3_SUMMARY.md` - Phase 3 完整報告
- `BACKEND_TECH_SPEC.md` - 後端技術規格
- `README.md` - 專案說明
