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
│   │   ├── auth/                    # 身份驗證模組 (US-002, FR-001-010)
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts   # POST /api/auth/register, /login, /logout, /refresh, GET /api/auth/me, POST /api/auth/forgot-password, /reset-password, /change-password
│   │   │   ├── auth.service.ts      # 密碼雜湊 (bcrypt)、JWT 簽發、Token 刷新、密碼重設
│   │   │   ├── strategies/          # Passport 策略 (jwt.strategy.ts, local.strategy.ts)
│   │   │   ├── dto/                 # LoginDto, RegisterDto, ResetPasswordDto, ChangePasswordDto
│   │   │   ├── guards/              # JwtAuthGuard, RolesGuard, LocalAuthGuard
│   │   │   ├── entities/            # password-reset-token.entity.ts
│   │   │   └── services/            # password.service.ts (bcrypt 加密)
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
│   │   │   ├── mail.service.ts      # 發送 OTP, 邀請信, 提醒信, 密碼重設信
│   │   │   └── templates/           # 郵件範本 (Handlebars): otp-verification.hbs, exam-link.hbs, password-reset.hbs, taker-invitation.hbs
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

---

## 實作階段進度

### Phase 0: 研究與設計決策 ✅ 已完成

**完成日期**: 2025-10-31

**產出文件**: [`research.md`](./research.md)

**研究項目**:

- ✅ R1: 隨機出題演算法（Seed-based + 批次 ID）
- ✅ R2: OTP 郵件發送最佳實踐（Nodemailer + AWS SES + Queue）
- ✅ R3: Stripe Webhook 安全處理（簽章驗證 + Idempotency）
- ✅ R4: PDF 生成效能優化（pdf-lib + 背景任務 + S3 快取）
- ✅ R5: 多語言 i18n 實作方案（nestjs-i18n + JSON 翻譯檔）
- ✅ R6: 會話管理與裝置追蹤（JWT Refresh Token + Redis）
- ✅ R7: 題庫規模計算（100 題/版本）
- ✅ R8: Stripe 付款流程設計（Checkout Session + Webhook）

**關鍵技術決策**:

- 隨機出題: Seed-based 演算法確保團體測驗一致性
- OTP 發送: 非同步 Queue 處理，60 秒速率限制
- 會話管理: JWT + Redis，受測者 10 天，管理者 1 小時
- PDF 生成: 背景任務佇列，S3 快取結果

---

### Phase 1: 資料模型與 API 設計 ✅ 已完成

**完成日期**: 2025-10-31

**產出文件**:

- [`data-model.md`](./data-model.md) - 完整資料庫 Schema 設計
- [`contracts/openapi.yaml`](./contracts/openapi.yaml) - OpenAPI 3.0 規格
- [`quickstart.md`](./quickstart.md) - 本地開發環境設定指南

**資料模型設計** (11 個核心實體):

1. ✅ User - 使用者（支援 4 種角色，含密碼欄位）
2. ✅ Exam - 測驗實例（含題目序列、狀態管理）
3. ✅ Question - 題目（末梢血版 + 骨髓版）
4. ✅ CellImage - 細胞圖片（每題 10 張）
5. ✅ AnswerRecord - 答案記錄（含正確性、作答時間）
6. ✅ ResultReport - 結果報表（含統計資訊、PDF URL）
7. ✅ GroupExamBatch - 團體測驗批次（含題目組合、管理 Token）
8. ✅ OTPVerification - OTP 驗證記錄（含嘗試次數、鎖定狀態）
9. ✅ PaymentRecord - 付款記錄（Stripe 整合）
10. ✅ Session - 會話管理（裝置指紋、過期時間）
11. ✅ PasswordResetToken - 密碼重設 Token（含過期時間）

**API 端點設計** (45+ 端點):

- ✅ Auth: 完整身份驗證流程
  - POST /auth/register - 使用者註冊（含密碼）
  - POST /auth/login - 使用者登入
  - POST /auth/logout - 使用者登出
  - POST /auth/refresh - 刷新 Access Token
  - GET /auth/me - 取得當前使用者資訊
  - POST /auth/forgot-password - 忘記密碼（發送重設連結）
  - POST /auth/reset-password - 重設密碼（使用 Token）
  - POST /auth/change-password - 變更密碼（已登入使用者）
- ✅ Users: 個人資料管理（GET/PUT /users/profile）
- ✅ OTP: 發送驗證碼、驗證（POST /otp/send, /otp/verify）
- ✅ Exams: 開始測驗、取得題目、查詢進度（POST /exams/start, GET /exams/{id}/current）
- ✅ Answers: 提交答案、查詢答案記錄（POST /answers/submit）
- ✅ Reports: 查看報表、下載 PDF（GET /reports/{id}, /reports/{id}/pdf）
- ✅ Payments: 建立 Checkout、Webhook（POST /payments/create-checkout, /payments/webhook）
- ✅ Groups: 批次管理、配布者設定（POST /groups/batches, /groups/batches/{id}/configure）

**開發環境設定**:

- ✅ Docker Compose 快速啟動（MySQL + Redis + API）
- ✅ 環境變數範本（.env.example）
- ✅ 種子資料腳本（200 題 + 2000 張圖片）
- ✅ Stripe CLI 整合指南
- ✅ Mailtrap / MailHog 郵件測試設定

**Agent Context 更新**:

- ✅ GitHub Copilot context 檔案已更新（.github/copilot-instructions.md）

---

### Constitution Check (Phase 1 Re-evaluation) ✅ 通過

**重新評估日期**: 2025-10-31

**結論**: 所有 Constitution 原則持續符合，資料模型與 API 設計符合最佳實踐。

**具體驗證**:

#### Principle I: Code Quality

- ✅ **資料模型**: TypeORM Entity 定義清晰，遵循單一職責
- ✅ **API 設計**: RESTful 原則，統一回應格式，錯誤處理標準化
- ✅ **命名規範**: snake_case (DB), camelCase (TypeScript), kebab-case (URL)

#### Principle II: Testing

- ✅ **可測試性**: 資料模型設計支援單元測試（Repository mocking）
- ✅ **E2E 測試**: API 端點設計完整，可撰寫端到端測試
- ✅ **測試資料**: 種子資料腳本提供測試基礎

#### Principle III: UX Consistency

- ✅ **統一回應**: ApiResponse 統一格式（success, statusCode, message, data）
- ✅ **錯誤處理**: ErrorResponse 統一格式（含 timestamp, path）
- ✅ **多語言支援**: i18n 整合於 API 設計（Accept-Language Header）

#### Principle IV: Performance

- ✅ **索引策略**: 所有外鍵、查詢欄位、唯一欄位皆有索引
- ✅ **快取設計**: Redis Session Store, PDF URL 快取, 題目序列快取
- ✅ **非同步處理**: 郵件發送、PDF 生成使用 Queue

#### Principle V: Traditional Chinese

- ✅ **文檔語言**: research.md, data-model.md, quickstart.md 皆為繁體中文
- ✅ **API 文檔**: OpenAPI 規格使用繁體中文描述（summary, description）
- ✅ **程式碼註解**: TypeORM Entity 註解使用繁體中文

**Quality Gates 狀態**:

- ✅ 資料模型設計審查通過
- ✅ API 合約設計審查通過
- ✅ 開發環境可正常啟動
- ⏳ 自動化測試（待 Phase 2 實作）

---

### Phase 2: 任務拆解與實作 🔄 待執行

**說明**: Phase 2 需要單獨執行 `/speckit.tasks` 指令來生成 `tasks.md`

**預期產出**: `tasks.md` - 包含所有實作任務、優先級、依賴關係、預估工時

**任務類別**:

- 基礎設施設定（TypeORM, Redis, AWS S3, Stripe）
- 核心功能實作（Authentication, OTP, Exam, Answer, Report, Payment, Group）
- 測試撰寫（單元測試、整合測試、E2E 測試）
- 文檔撰寫（API 文檔、部署文檔）

**下一步**: 執行 `npx specify tasks` 或按照 `.github/prompts/speckit.tasks.prompt.md` 指示生成任務清單。
