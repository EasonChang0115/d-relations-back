# 快速開始：醫學細胞識別能力測驗平台

**分支**: `001-medical-cell-test` | **日期**: 2025-10-31 | **階段**: Phase 1 - Quickstart Guide

## 概述

本文件提供醫學細胞識別能力測驗平台後端 API 的本地開發環境設定指南，讓開發人員能快速啟動專案並進行開發測試。

---

## 系統需求

### 必要軟體

- **Node.js**: v18 LTS 或 v20 LTS
- **npm**: v9+ 或 **yarn**: v1.22+
- **MySQL**: v8.0
- **Git**: v2.30+
- **Docker** (可選): v20+ 與 Docker Compose v2+

### 開發工具（推薦）

- **VS Code**: 最新版本
- **Postman** 或 **Insomnia**: API 測試工具
- **MySQL Workbench** 或 **DBeaver**: 資料庫管理工具

### 雲端服務帳號（開發環境可選）

- **AWS Account**: S3 檔案儲存（可用本地檔案系統替代）
- **Stripe Account**: 付款測試（Test Mode）
- **Gmail SMTP** 或 **AWS SES**: 郵件發送（開發環境可用 Mailtrap）

---

## 快速安裝（5 分鐘）

### 方案 A: 使用 Docker Compose（推薦）

```bash
# 1. 複製專案
git clone <repository-url>
cd medical-cell-exam-platform

# 2. 切換到功能分支
git checkout 001-medical-cell-test

# 3. 複製環境變數範本
cp .env.example .env

# 4. 啟動所有服務（MySQL + Redis + API）
docker-compose up -d

# 5. 查看服務狀態
docker-compose ps

# 6. 查看 API 日誌
docker-compose logs -f api

# 7. 執行資料庫種子資料
docker-compose exec api npm run seed

# API 現在運行在 http://localhost:3000
# Swagger 文檔可在 http://localhost:3000/api 查看
```

### 方案 B: 本地手動安裝

```bash
# 1. 複製專案
git clone <repository-url>
cd medical-cell-exam-platform
git checkout 001-medical-cell-test

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env
# 編輯 .env 填入必要設定（見下方說明）

# 4. 啟動 MySQL（Docker）
docker run --name mysql_dev \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=medical_exam_dev \
  -e MYSQL_USER=exam_user \
  -e MYSQL_PASSWORD=exam_pass \
  -p 3306:3306 \
  -d mysql:8.0

# 5. 啟動 Redis（Docker）
docker run --name redis_dev \
  -p 6379:6379 \
  -d redis:7-alpine

# 6. 執行資料庫遷移（TypeORM 自動同步開發環境）
# npm run migration:run

# 7. 載入種子資料
npm run seed

# 8. 啟動開發伺服器
npm run start:dev

# API 現在運行在 http://localhost:3000
```

---

## 環境變數設定

### .env 檔案範例

```env
# ==================== Application ====================
NODE_ENV=development
PORT=3000
API_PREFIX=/api

# ==================== URLs ====================
WEB_URL=http://localhost:3001
API_URL=http://localhost:3000

# ==================== Database ====================
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=exam_user
DB_PASSWORD=exam_pass
DB_DATABASE=medical_exam_dev
DB_SYNCHRONIZE=true  # 開發環境自動同步 schema（生產環境設為 false）

# ==================== JWT ====================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-token-secret-key
JWT_REFRESH_EXPIRES_IN=10d

# ==================== Redis ====================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# ==================== AWS S3 ====================
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=medical-exam-images-dev
# 開發環境可使用 LocalStack 或 MinIO 模擬 S3

# ==================== Mail (開發環境使用 Mailtrap) ====================
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_FROM_ADDRESS=noreply@medical-exam.local
MAIL_FROM_NAME=醫學細胞測驗平台

# 生產環境使用 AWS SES
# MAIL_HOST=email-smtp.ap-northeast-1.amazonaws.com
# MAIL_PORT=587
# MAIL_USERNAME=your-ses-smtp-username
# MAIL_PASSWORD=your-ses-smtp-password

# ==================== Stripe (Test Mode) ====================
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ==================== CORS ====================
CORS_ORIGIN=http://localhost:3001,http://localhost:3000

# ==================== Rate Limiting ====================
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### 必要欄位說明

| 欄位                          | 說明                   | 取得方式                                                      |
| ----------------------------- | ---------------------- | ------------------------------------------------------------- |
| `JWT_SECRET`                  | JWT 簽章金鑰           | 使用 `openssl rand -base64 32` 生成                           |
| `JWT_REFRESH_SECRET`          | Refresh Token 簽章金鑰 | 使用 `openssl rand -base64 32` 生成                           |
| `STRIPE_SECRET_KEY`           | Stripe 測試模式金鑰    | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) |
| `STRIPE_WEBHOOK_SECRET`       | Stripe Webhook 簽章    | 使用 Stripe CLI 或 Dashboard 設定                             |
| `MAIL_HOST` / `MAIL_USERNAME` | 郵件服務設定           | [Mailtrap](https://mailtrap.io/) 註冊取得                     |

### 開發環境簡化設定

如果只是快速測試，可以暫時跳過以下服務：

- **AWS S3**: 使用本地檔案系統或 [MinIO](https://min.io/)
- **Stripe**: 跳過付款測試，直接模擬付款成功
- **郵件服務**: 使用 [Mailtrap](https://mailtrap.io/) 免費方案或 [MailHog](https://github.com/mailhog/MailHog)

---

## 資料庫設定

### 建立資料庫（如未使用 Docker）

```sql
-- 連線至 MySQL
mysql -u root -p

-- 建立資料庫
CREATE DATABASE medical_exam_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 建立使用者
CREATE USER 'exam_user'@'localhost' IDENTIFIED BY 'exam_pass';
GRANT ALL PRIVILEGES ON medical_exam_dev.* TO 'exam_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### 執行種子資料

種子資料包含：

- 100 題末梢血版題目 + 1000 張圖片（10 張/題）
- 100 題骨髓版題目 + 1000 張圖片（10 張/題）
- 測試用管理員帳號
- 測試用一般使用者帳號

```bash
npm run seed

# 輸出範例：
# ✓ 已建立 100 題末梢血版題目
# ✓ 已建立 1000 張末梢血版圖片
# ✓ 已建立 100 題骨髓版題目
# ✓ 已建立 1000 張骨髓版圖片
# ✓ 已建立 2 個測試使用者
# ✓ 種子資料載入完成
```

### 重置資料庫

```bash
# 清空資料庫並重新載入種子資料
npm run seed:reset

# 或手動執行
npm run migration:revert
npm run migration:run
npm run seed
```

---

## 啟動開發伺服器

### 開發模式（熱重載）

```bash
npm run start:dev

# 輸出範例：
# [Nest] 12345  - 2025/10/31 10:00:00     LOG [NestFactory] Starting Nest application...
# [Nest] 12345  - 2025/10/31 10:00:01     LOG [InstanceLoader] AppModule dependencies initialized
# [Nest] 12345  - 2025/10/31 10:00:01     LOG [InstanceLoader] TypeOrmModule dependencies initialized
# [Nest] 12345  - 2025/10/31 10:00:02     LOG [NestApplication] Nest application successfully started
# [Nest] 12345  - 2025/10/31 10:00:02     LOG Application is running on: http://localhost:3000
# [Nest] 12345  - 2025/10/31 10:00:02     LOG Swagger documentation: http://localhost:3000/api
```

### 生產模式

```bash
# 建置
npm run build

# 啟動
npm run start:prod
```

### Debug 模式

```bash
npm run start:debug

# 然後在 VS Code 中附加 debugger（Port: 9229）
```

---

## 驗證安裝

### 1. 檢查 API 健康狀態

```bash
curl http://localhost:3000/api/health

# 預期輸出：
# {
#   "status": "ok",
#   "timestamp": "2025-10-31T10:00:00.000Z",
#   "uptime": 123.45
# }
```

### 2. 訪問 Swagger 文檔

開啟瀏覽器訪問：`http://localhost:3000/api`

您應該會看到完整的 API 文檔介面，可以直接測試所有端點。

### 3. 測試資料庫連線

```bash
# 查看應用程式日誌，應包含：
# [TypeOrmModule] Database connection established
```

### 4. 測試免費版測驗流程

使用 Postman 或 curl 測試完整流程：

```bash
# 1. 開始免費版測驗
curl -X POST http://localhost:3000/api/exams/start \
  -H "Content-Type: application/json" \
  -d '{
    "exam_type": "peripheral_blood",
    "version": "free"
  }'

# 2. 取得當前題目
curl http://localhost:3000/api/exams/{exam_id}/current \
  -H "Authorization: Bearer {access_token}"

# 3. 提交答案
curl -X POST http://localhost:3000/api/answers/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {access_token}" \
  -d '{
    "exam_id": "{exam_id}",
    "question_order": 1,
    "answer": "Neutrophil"
  }'

# 4. 查看結果報表（完成所有 15 題後）
curl http://localhost:3000/api/reports/{exam_id} \
  -H "Authorization: Bearer {access_token}"
```

---

## 常用開發指令

### 開發相關

```bash
# 啟動開發伺服器（熱重載）
npm run start:dev

# 啟動 Debug 模式
npm run start:debug

# 建置專案
npm run build

# 啟動生產模式
npm run start:prod
```

### 測試相關

```bash
# 單元測試
npm run test

# 單元測試（Watch 模式）
npm run test:watch

# E2E 測試
npm run test:e2e

# 測試覆蓋率
npm run test:cov

# 測試覆蓋率（並開啟報告）
npm run test:cov && open coverage/lcov-report/index.html
```

### 程式碼品質

```bash
# ESLint 檢查
npm run lint

# ESLint 自動修復
npm run lint:fix

# Prettier 格式化
npm run format

# 型別檢查
npm run type-check
```

### 資料庫相關

```bash
# 執行種子資料
npm run seed

# 重置資料庫
npm run seed:reset

# 生成遷移檔案（如有 schema 變更）
npm run migration:generate -- -n MigrationName

# 執行遷移
npm run migration:run

# 回滾遷移
npm run migration:revert
```

### Docker 相關

```bash
# 啟動所有服務
docker-compose up -d

# 停止所有服務
docker-compose down

# 查看服務狀態
docker-compose ps

# 查看日誌
docker-compose logs -f api

# 重建並啟動
docker-compose up -d --build

# 清理（包含 volumes）
docker-compose down -v
```

---

## 開發工具設定

### VS Code 擴充套件（推薦）

在專案根目錄建立 `.vscode/extensions.json`：

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "firsttris.vscode-jest-runner",
    "humao.rest-client",
    "rangav.vscode-thunder-client"
  ]
}
```

### VS Code 設定

在專案根目錄建立 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Debug 設定

在專案根目錄建立 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to NestJS",
      "port": 9229,
      "restart": true,
      "stopOnEntry": false,
      "protocol": "inspector"
    }
  ]
}
```

---

## Stripe 付款測試

### 設定 Stripe CLI（本地 Webhook 測試）

```bash
# 1. 安裝 Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/vX.X.X/stripe_X.X.X_linux_x86_64.tar.gz
tar -xvf stripe_X.X.X_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin

# 2. 登入 Stripe
stripe login

# 3. 轉發 Webhook 至本地
stripe listen --forward-to localhost:3000/api/payments/webhook

# 4. 複製 webhook signing secret 至 .env
# 輸出範例：
# > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### 測試信用卡號碼

Stripe Test Mode 提供以下測試卡號：

| 卡號                  | 用途                 |
| --------------------- | -------------------- |
| `4242 4242 4242 4242` | 付款成功             |
| `4000 0000 0000 0002` | 卡片被拒（一般錯誤） |
| `4000 0000 0000 9995` | 餘額不足             |
| `4000 0025 0000 3155` | 需要 3D Secure 驗證  |

- **到期日**: 任何未來日期（如 12/34）
- **CVC**: 任意 3 位數（如 123）
- **ZIP**: 任意 5 位數（如 12345）

### 測試付款流程

```bash
# 1. 建立 Checkout Session
curl -X POST http://localhost:3000/api/payments/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "payment_type": "individual_exam",
    "exam_type": "peripheral_blood",
    "user_info": {
      "name": "測試使用者",
      "email": "test@example.com"
    }
  }'

# 2. 開啟返回的 checkout_url 在瀏覽器中完成付款
# 3. Stripe CLI 會顯示 Webhook 事件
# 4. 檢查資料庫 payment_records 表格確認付款狀態
```

---

## 郵件測試

### 使用 Mailtrap（推薦）

1. 前往 [Mailtrap.io](https://mailtrap.io/) 註冊免費帳號
2. 建立新的 Inbox
3. 複製 SMTP 設定至 `.env`：
   ```env
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your_username
   MAIL_PASSWORD=your_password
   ```
4. 測試發送 OTP：
   ```bash
   curl -X POST http://localhost:3000/api/otp/send \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "purpose": "exam_access",
       "exam_token": "test-token-123"
     }'
   ```
5. 在 Mailtrap Inbox 查看收到的郵件

### 使用 MailHog（本地 SMTP 伺服器）

```bash
# 使用 Docker 啟動 MailHog
docker run -d \
  --name mailhog \
  -p 1025:1025 \
  -p 8025:8025 \
  mailhog/mailhog

# 更新 .env
# MAIL_HOST=localhost
# MAIL_PORT=1025
# MAIL_USERNAME=
# MAIL_PASSWORD=

# 訪問 Web UI: http://localhost:8025
```

---

## 常見問題與解決方案

### Q1: 資料庫連線失敗

**錯誤訊息**: `Unable to connect to the database`

**解決方案**:

```bash
# 檢查 MySQL 是否啟動
docker ps | grep mysql

# 測試資料庫連線
mysql -h localhost -u exam_user -p -D medical_exam_dev

# 檢查 .env 設定是否正確
cat .env | grep DB_
```

### Q2: Port 3000 已被佔用

**錯誤訊息**: `address already in use :::3000`

**解決方案**:

```bash
# 找出佔用 Port 的程序
# macOS/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# 修改 .env 中的 PORT
PORT=3001
```

### Q3: TypeORM 同步失敗

**錯誤訊息**: `QueryFailedError: Table 'xxx' already exists`

**解決方案**:

```bash
# 方案 A: 清空資料庫重新建立
npm run seed:reset

# 方案 B: 暫時關閉同步，使用遷移
# 在 .env 設定：
# DB_SYNCHRONIZE=false
# 然後執行：
npm run migration:run
```

### Q4: Stripe Webhook 未觸發

**問題**: 付款成功但系統未收到 Webhook

**解決方案**:

```bash
# 確認 Stripe CLI 正在運行
stripe listen --forward-to localhost:3000/api/payments/webhook

# 檢查 STRIPE_WEBHOOK_SECRET 是否正確
echo $STRIPE_WEBHOOK_SECRET

# 查看應用程式日誌
docker-compose logs -f api | grep webhook
```

### Q5: 圖片無法載入

**問題**: 測驗頁面顯示圖片載入失敗

**解決方案**:

```bash
# 檢查種子資料是否已載入
mysql -u exam_user -p -D medical_exam_dev \
  -e "SELECT COUNT(*) FROM cell_images;"

# 檢查 S3 設定（或使用本地儲存）
# 開發環境可暫時使用 placeholder 圖片
```

### Q6: OTP 郵件未收到

**問題**: 發送 OTP 後郵件未送達

**解決方案**:

```bash
# 檢查 Mailtrap Inbox 或 MailHog Web UI
# http://localhost:8025 (MailHog)

# 檢查郵件佇列狀態（Redis）
redis-cli
> KEYS mail:queue:*

# 查看應用程式日誌
docker-compose logs -f api | grep mail
```

---

## 效能優化（開發環境）

### 加速資料庫查詢

```sql
-- 確認索引已建立
SHOW INDEX FROM exams;
SHOW INDEX FROM questions;

-- 分析慢查詢
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.5;
```

### 減少依賴安裝時間

```bash
# 使用 npm ci 取代 npm install（CI 環境）
npm ci

# 清除快取
npm cache clean --force
```

### 使用 SWC 加速編譯

NestJS 專案已設定使用 SWC，確認 `nest-cli.json`:

```json
{
  "compilerOptions": {
    "builder": "swc"
  }
}
```

---

## 下一步

完成本地環境設定後，您可以：

1. **閱讀 API 文檔**: `http://localhost:3000/api`
2. **查看資料模型**: `specs/001-medical-cell-test/data-model.md`
3. **研究技術決策**: `specs/001-medical-cell-test/research.md`
4. **開始實作功能**: 參考 `specs/001-medical-cell-test/tasks.md`（Phase 2 生成）

---

## 支援與回饋

- **技術問題**: 在 GitHub Issues 提出
- **安全漏洞**: 透過私人管道聯絡團隊
- **功能建議**: 在 GitHub Discussions 討論

祝開發順利！ 🚀
