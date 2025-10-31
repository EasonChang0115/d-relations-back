# 實作計畫：醫學細胞識別能力測驗平台

**分支**: `001-medical-cell-test` | **日期**: 2025-10-31 | **規格**: [spec.md](./spec.md)
**輸入**: 功能規格來自 `/specs/001-medical-cell-test/spec.md`

**備註**: 本檔案由 `/speckit.plan` 指令產生。執行流程詳見 `.specify/templates/commands/plan.md`。

## 摘要

本專案建立一個線上醫學細胞識別能力測驗平台，提供免費版（15 題）、付費版個人測驗（20 題）及付費版團體測驗功能。系統採用 NestJS + TypeScript 後端架構，整合 MySQL 資料庫、Stripe 付款、OTP 郵件驗證、AWS S3 檔案儲存及 PDF 報表生成。主要技術挑戰包括：隨機出題機制（確保團體測驗一致性）、會話管理（支援跨裝置 OTP 驗證）、多語言介面（可配置）及複雜的使用者角色管理（免費使用者、付費使用者、團體管理者、受測者）。

## 技術背景

**語言/版本**: TypeScript 5.7.3 (編譯目標: ES2023, 模組系統: CommonJS)  
**執行環境**: Node.js 18+ (推薦 18 LTS 或 20 LTS)  
**主要框架**: NestJS 11.0.1 (Module-Controller-Service 架構)  
**主要依賴**:

- **資料庫**: MySQL 8.0 + TypeORM 0.3.25 + mysql2 3.14.2
- **身份驗證**: Passport.js 0.7.0 + JWT (@nestjs/jwt 11.0.0, passport-jwt 4.0.1)
- **密碼加密**: bcrypt 6.0.0
- **檔案儲存**: AWS S3 (@aws-sdk/client-s3 3.846.0, multer-s3 3.0.1)
- **郵件服務**: @nestjs-modules/mailer 2.0.2 + nodemailer 7.0.5
- **付款整合**: Stripe SDK (需研究最新版本)
- **資料驗證**: class-validator 0.14.2 + class-transformer 0.5.1
- **API 文檔**: @nestjs/swagger 11.2.0 + swagger-ui-express 5.0.1
- **PDF 生成**: pdf-lib 1.17.1
- **Excel 處理**: exceljs 4.4.0
- **日期處理**: date-fns 4.1.0

**測試框架**: Jest 29.7.0 + ts-jest 29.2.5 + supertest 7.0.0  
**建置工具**: SWC (@swc/core 1.10.7) + ts-loader 9.5.2  
**程式碼品質**: ESLint 9.18.0 + Prettier 3.4.2 + typescript-eslint 8.20.0  
**目標平台**: Linux 伺服器 (Docker 容器化部署)  
**專案類型**: Web API (RESTful 後端服務)  
**效能目標**:

- API 回應時間: p95 <200ms, p99 <500ms
- 圖片載入: <2 秒 (第一題含圖片)
- 答案提交: <1 秒顯示下一題
- PDF 生成: <5 秒
- OTP 郵件發送: <1 分鐘送達
- 支援並發: ≥100 位使用者同時測驗

**約束條件**:

- 後端記憶體: <512MB per instance
- 資料庫查詢: <100ms (簡單查詢), <500ms (複雜聚合)
- 團體測驗題目一致性: 100% 相同題目與圖片組合
- OTP 安全限制: 10 次錯誤嘗試鎖定 5 分鐘, 重發間隔 60 秒
- 會話管理: 10 天有效期限 (受測者), 1 小時無操作過期 (管理者)
- 多語言支援: 可配置語言選項

**規模/範圍**:

- 預估使用者: 1,000+ 活躍使用者
- 題庫規模: 需研究 (末梢血版 + 骨髓版各需多少題目)
- 細胞圖片: 每種細胞 10 張圖片
- API 端點: 約 30-40 個 (認證、使用者、測驗、付款、管理)
- 資料庫表格: 約 10-12 個核心實體
- 程式碼規模: 預估 15,000-20,000 LOC

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Principle I: Code Quality

- [x] **Readability**: 將採用 NestJS 標準架構 (Module-Controller-Service)，遵循單一職責原則
- [x] **Type Safety**: TypeScript 5.7.3 啟用 strict mode，所有函式與變數明確型別標註
- [x] **Error Handling**: 統一錯誤處理中間件，自訂例外類別 (BadRequestException, UnauthorizedException 等)
- [x] **Documentation**: 所有 API 使用 Swagger 註解，複雜邏輯加入 JSDoc 註釋

### Principle II: Testing

- [x] **TDD Mandatory**: 採用 Test-First 開發，先寫測試再實作
- [x] **80% Coverage**: Jest 設定覆蓋率門檻 80% (statements, branches, functions, lines)
- [x] **Test Categories**: 單元測試 (Services/Guards)、整合測試 (Repositories/Controllers)、E2E 測試 (完整 API 流程)
- [x] **CI Integration**: GitHub Actions 執行測試套件，未通過不得合併

### Principle III: UX Consistency

- [x] **Response Time**: API 回應 <200ms (p95), 錯誤訊息即時回饋
- [x] **Accessibility**: 統一錯誤訊息格式 (i18n 支援多語言)
- [x] **Consistency**: RESTful API 設計準則，統一 `/api` 路徑前綴

### Principle IV: Performance

- [x] **API Performance**: p95 <200ms, p99 <500ms (含資料庫查詢)
- [x] **Scalability**: 水平擴展設計 (無狀態 API, JWT 認證, Redis Session)
- [x] **Monitoring**: 需整合 APM 工具 (New Relic / Datadog)，追蹤慢查詢與錯誤率

### Principle V: Traditional Chinese

- [x] **Documentation Language**: 所有 spec.md, plan.md, tasks.md, research.md 採用繁體中文
- [x] **User-Facing Content**: 錯誤訊息、通知信件、PDF 報表支援繁體中文 (透過 i18n)
- [x] **Code Comments**: 複雜邏輯使用繁體中文註解，變數/函式名稱使用英文

### Quality Gates

**Automated Gates** (Pre-Merge):

- [x] 所有測試通過 (Jest + Supertest)
- [x] 覆蓋率 ≥80%
- [x] ESLint 無錯誤
- [x] Prettier 格式檢查通過

**Manual Gates** (Code Review):

- [x] 至少一位 reviewer 核准
- [x] 設計審查：資料模型與 API 合約符合規格
- [x] 效能審查：關鍵查詢有索引，無 N+1 問題

**結論**: 所有 Constitution 原則皆符合，可進入 Phase 0 研究階段。

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (NestJS Backend)

```text
backend/
├── src/
│   ├── main.ts                      # 應用程式進入點
│   ├── app.module.ts                # 根模組
│   ├── app.controller.ts            # 健康檢查端點
│   ├── app.service.ts
│   │
│   ├── common/                      # 共用元件
│   │   ├── decorators/              # 自訂裝飾器 (@CurrentUser, @Roles 等)
│   │   ├── filters/                 # 全域例外過濾器
│   │   ├── guards/                  # 守衛 (JwtAuthGuard, RolesGuard)
│   │   ├── interceptors/            # 攔截器 (TransformInterceptor, LoggingInterceptor)
│   │   ├── middleware/              # 中間件 (LoggerMiddleware)
│   │   ├── pipes/                   # 管道 (ValidationPipe)
│   │   └── dto/                     # 共用 DTO (PaginationDto, ResponseDto)
│   │
│   ├── config/                      # 配置模組
│   │   ├── database.config.ts       # TypeORM 配置
│   │   ├── jwt.config.ts            # JWT 配置
│   │   ├── aws.config.ts            # AWS S3 配置
│   │   ├── mail.config.ts           # 郵件服務配置
│   │   ├── stripe.config.ts         # Stripe 配置
│   │   └── app.config.ts            # 應用程式配置
│   │
│   ├── modules/
│   │   ├── auth/                    # 身份驗證模組 (US-001, FR-008-016)
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts   # POST /api/auth/register, /login
│   │   │   ├── auth.service.ts      # 密碼雜湊、JWT 簽發
│   │   │   ├── strategies/          # Passport 策略 (jwt.strategy.ts, google.strategy.ts)
│   │   │   ├── dto/                 # LoginDto, RegisterDto
│   │   │   └── guards/              # JwtAuthGuard, RolesGuard
│   │   │
│   │   ├── users/                   # 使用者管理模組 (US-002, FR-017-022)
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts  # GET /api/users/me, PATCH /api/users/:id
│   │   │   ├── users.service.ts
│   │   │   ├── entities/            # user.entity.ts
│   │   │   ├── dto/                 # UpdateUserDto, UserResponseDto
│   │   │   └── repositories/        # users.repository.ts
│   │   │
│   │   ├── otp/                     # OTP 驗證模組 (FR-002-007)
│   │   │   ├── otp.module.ts
│   │   │   ├── otp.controller.ts    # POST /api/otp/send, /api/otp/verify
│   │   │   ├── otp.service.ts       # 生成 6 位數 OTP, 驗證邏輯
│   │   │   ├── entities/            # otp-verification.entity.ts
│   │   │   └── dto/                 # SendOtpDto, VerifyOtpDto
│   │   │
│   │   ├── exams/                   # 測驗管理模組 (US-003, FR-023-044)
│   │   │   ├── exams.module.ts
│   │   │   ├── exams.controller.ts  # POST /api/exams/start, GET /api/exams/:id/questions
│   │   │   ├── exams.service.ts     # 隨機出題邏輯, 會話管理
│   │   │   ├── entities/            # exam.entity.ts, exam-session.entity.ts
│   │   │   ├── dto/                 # StartExamDto, ExamResponseDto
│   │   │   └── repositories/        # exams.repository.ts
│   │   │
│   │   ├── questions/               # 題庫管理模組 (FR-027-030)
│   │   │   ├── questions.module.ts
│   │   │   ├── questions.controller.ts # GET /api/questions (管理者)
│   │   │   ├── questions.service.ts # 題目與圖片關聯
│   │   │   ├── entities/            # question.entity.ts, cell-image.entity.ts
│   │   │   ├── dto/                 # CreateQuestionDto
│   │   │   └── repositories/        # questions.repository.ts
│   │   │
│   │   ├── answers/                 # 答案紀錄模組 (FR-031-036)
│   │   │   ├── answers.module.ts
│   │   │   ├── answers.controller.ts # POST /api/answers, GET /api/answers/exam/:id
│   │   │   ├── answers.service.ts   # 計算分數, 正確率
│   │   │   ├── entities/            # answer-record.entity.ts
│   │   │   └── dto/                 # SubmitAnswerDto
│   │   │
│   │   ├── reports/                 # 報表生成模組 (FR-037-044)
│   │   │   ├── reports.module.ts
│   │   │   ├── reports.controller.ts # GET /api/reports/:id/pdf, /api/reports/:id/excel
│   │   │   ├── reports.service.ts   # PDF 生成 (pdf-lib), Excel 生成 (exceljs)
│   │   │   ├── entities/            # result-report.entity.ts
│   │   │   ├── dto/                 # ReportResponseDto
│   │   │   └── templates/           # PDF 範本
│   │   │
│   │   ├── payments/                # 付款模組 (US-004, FR-045-055)
│   │   │   ├── payments.module.ts
│   │   │   ├── payments.controller.ts # POST /api/payments/create, /api/payments/webhook
│   │   │   ├── payments.service.ts  # Stripe 整合
│   │   │   ├── entities/            # payment-record.entity.ts
│   │   │   └── dto/                 # CreatePaymentDto
│   │   │
│   │   ├── groups/                  # 團體測驗模組 (US-005, US-006, FR-056-074)
│   │   │   ├── groups.module.ts
│   │   │   ├── groups.controller.ts # POST /api/groups/batches, GET /api/groups/batches/:id
│   │   │   ├── groups.service.ts    # 批次建立, 進度追蹤
│   │   │   ├── entities/            # group-exam-batch.entity.ts
│   │   │   └── dto/                 # CreateBatchDto, InviteTakerDto
│   │   │
│   │   ├── mail/                    # 郵件服務模組 (FR-075-080)
│   │   │   ├── mail.module.ts
│   │   │   ├── mail.service.ts      # 發送 OTP, 邀請信, 提醒信
│   │   │   └── templates/           # 郵件範本 (Handlebars)
│   │   │
│   │   └── storage/                 # 檔案儲存模組 (AWS S3)
│   │       ├── storage.module.ts
│   │       ├── storage.service.ts   # 上傳/下載圖片
│   │       └── dto/                 # UploadFileDto
│   │
│   ├── database/                    # 資料庫遷移與種子資料
│   │   ├── migrations/              # TypeORM 遷移檔案
│   │   └── seeds/                   # 初始資料 (題庫, 管理者帳號)
│   │
│   └── utils/                       # 工具函式
│       ├── date.util.ts             # 日期處理
│       ├── hash.util.ts             # 雜湊函式
│       └── random.util.ts           # 隨機數生成
│
├── test/                            # E2E 測試
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   ├── exams.e2e-spec.ts
│   ├── payments.e2e-spec.ts
│   └── groups.e2e-spec.ts
│
├── .env.example                     # 環境變數範例
├── .eslintrc.js                     # ESLint 配置
├── .prettierrc                      # Prettier 配置
├── jest.config.js                   # Jest 配置
├── nest-cli.json                    # NestJS CLI 配置
├── package.json
├── tsconfig.json                    # TypeScript 配置
├── tsconfig.build.json
├── Dockerfile                       # Docker 映像檔
└── docker-compose.yml               # 開發環境配置
```

**結構說明**: 採用 NestJS 標準 Feature-based 模組架構，每個功能模組 (auth, users, exams 等) 包含 Controller、Service、Entity、DTO、Repository。`common/` 目錄集中共用元件 (guards, filters, interceptors)，`config/` 目錄管理各服務配置，`database/` 目錄處理資料庫遷移與種子資料。所有測試檔案與源碼放在相同目錄 (`.spec.ts`)，E2E 測試集中在 `test/` 目錄。

## Complexity Tracking

> **本專案無 Constitution 違規，此表格保持空白。**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |
