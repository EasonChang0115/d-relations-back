---
description: "醫學細胞識別能力測驗平台 - 任務清單"
---

# Tasks: 醫學細胞識別能力測驗平台

**分支**: `001-medical-cell-test` | **日期**: 2025-10-31
**輸入**: 設計文件來自 `/specs/001-medical-cell-test/`
**必要文件**: plan.md (技術棧、專案結構)、spec.md (使用者故事與需求)、data-model.md (資料實體)、contracts/ (API 端點)、research.md (技術決策)、quickstart.md (測試場景)

**測試說明**: 本專案規格未明確要求 TDD 開發，因此以下任務清單**不包含**測試任務。如需新增測試，請參考 Constitution Principle II 的覆蓋率要求 (80%)。

**組織方式**: 任務按使用者故事分組，使每個故事可獨立實作與測試。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可平行執行 (不同檔案、無相依性)
- **[Story]**: 任務所屬的使用者故事 (例如 US1, US2, US3)
- 描述中包含確切的檔案路徑

## 路徑慣例

本專案採用 NestJS 後端架構:

- 後端程式碼: `backend/src/`
- 測試檔案: `backend/test/` (E2E) 與 `backend/src/**/*.spec.ts` (單元測試)
- 資料庫遷移: `backend/src/database/migrations/`
- 設定檔: `backend/` 根目錄

---

## Phase 1: Setup (專案初始化)

**目的**: 建立專案基礎結構與開發環境

- [x] T001 建立 NestJS 專案結構，按照 plan.md 的目錄架構建立所有模組資料夾
- [x] T002 初始化 TypeScript 專案 (tsconfig.json, tsconfig.build.json)，啟用 strict mode
- [x] T003 [P] 配置 ESLint (eslintrc.js) 與 Prettier (.prettierrc)，遵循 NestJS 最佳實踐
- [x] T004 [P] 設定 Jest (jest.config.js) 測試框架，覆蓋率門檻 80%
- [x] T005 [P] 建立環境變數範本 (.env.example)，包含所有必要設定 (資料庫、JWT、AWS、Stripe、Mail)
- [x] T006 [P] 建立 Docker Compose 配置 (docker-compose.yml)，包含 MySQL 8.0、Redis 7、API 服務
- [x] T007 [P] 建立 Dockerfile，針對 Node.js 18 LTS 優化
- [x] T008 安裝所有主要依賴套件 (package.json): NestJS 11.0.1, TypeORM 0.3.25, mysql2, Passport, bcrypt, AWS SDK, Stripe, nodemailer, pdf-lib, exceljs

---

## Phase 2: Foundational (核心基礎建設)

**目的**: 建立所有使用者故事共用的核心基礎設施

**⚠️ 關鍵**: 此階段必須完成後，才能開始任何使用者故事的實作

### 資料庫與 ORM 設定

- [x] T009 設定 TypeORM 配置 (backend/src/config/database.config.ts)，包含連線池、日誌、自動同步設定
- [x] T010 建立資料庫遷移基礎架構 (backend/src/database/migrations/)，設定遷移指令於 package.json

### 認證與授權框架

- [x] T011 [P] 設定 JWT 配置 (backend/src/config/jwt.config.ts)，包含 Access Token (1h) 與 Refresh Token (10d)
- [x] T012 [P] 實作 JWT 策略 (backend/src/modules/auth/strategies/jwt.strategy.ts)，整合 Passport
- [x] T013 [P] 實作 JWT 認證守衛 (backend/src/common/guards/jwt-auth.guard.ts)
- [x] T014 [P] 實作角色守衛 (backend/src/common/guards/roles.guard.ts)，支援 4 種使用者角色
- [x] T015 [P] 建立自訂裝飾器 (backend/src/common/decorators/current-user.decorator.ts, roles.decorator.ts, public.decorator.ts)
- [x] T015a [P] 建立 Auth DTO (backend/src/modules/auth/dto/register.dto.ts, login.dto.ts)，包含密碼驗證規則
- [x] T015b [P] 實作 AuthService (backend/src/modules/auth/auth.service.ts)，處理註冊、登入、登出、Token 刷新邏輯
- [x] T015c [P] 實作密碼加密服務 (backend/src/modules/auth/services/password.service.ts)，使用 bcrypt
- [x] T015d [P] 實作 Local 策略 (backend/src/modules/auth/strategies/local.strategy.ts)，用於密碼登入驗證
- [x] T015e 實作 AuthController (backend/src/modules/auth/auth.controller.ts)，端點: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, POST /api/auth/refresh, GET /api/auth/me, POST /api/auth/forgot-password, POST /api/auth/reset-password, POST /api/auth/change-password
- [x] T015f 建立 AuthModule (backend/src/modules/auth/auth.module.ts)，整合所有認證相關服務

### API 架構與中間件

- [x] T016 [P] 建立全域例外過濾器 (backend/src/common/filters/http-exception.filter.ts)，統一錯誤格式
- [x] T017 [P] 建立轉換攔截器 (backend/src/common/interceptors/transform.interceptor.ts)，統一 API 回應格式
- [x] T018 [P] 建立日誌攔截器 (backend/src/common/interceptors/logging.interceptor.ts)，記錄請求與回應
- [x] T019 [P] 設定全域驗證管道 (backend/src/main.ts)，整合 class-validator 與 class-transformer
- [x] T020 [P] 建立共用 DTO (backend/src/common/dto/pagination.dto.ts, response.dto.ts, error-response.dto.ts)

### 外部服務配置

- [x] T021 [P] 設定 AWS S3 配置 (backend/src/config/aws.config.ts)，包含 Bucket 名稱、Region、認證
- [x] T022 [P] 設定郵件服務配置 (backend/src/config/mail.config.ts)，整合 nodemailer 與 AWS SES
- [x] T023 [P] 設定 Stripe 配置 (backend/src/config/stripe.config.ts)，包含 Secret Key 與 Webhook Secret
- [x] T024 [P] 設定 Redis 配置 (backend/src/config/redis.config.ts)，用於 Session 與 Queue

### 應用程式主模組

- [x] T025 建立 App Module (backend/src/app.module.ts)，整合所有功能模組與設定
- [x] T026 建立 App Controller (backend/src/app.controller.ts)，實作健康檢查端點 GET /health
- [x] T027 建立主進入點 (backend/src/main.ts)，設定 Swagger、CORS、全域管道、全域過濾器

### 密碼管理功能

- [x] T027a [P] 建立 PasswordResetToken 實體 (backend/src/modules/auth/entities/password-reset-token.entity.ts)，記錄重設 Token 與過期時間
- [x] T027b [P] 實作忘記密碼邏輯 (AuthService - forgotPassword 方法)，生成重設 Token 並發送郵件
- [x] T027c [P] 實作重設密碼邏輯 (AuthService - resetPassword 方法)，驗證 Token 並更新密碼
- [x] T027d [P] 實作變更密碼邏輯 (AuthService - changePassword 方法)，驗證舊密碼並更新新密碼
- [x] T027e [P] 建立密碼重設郵件範本 (backend/src/modules/mail/templates/password-reset.hbs)

**Checkpoint**: 基礎建設完成 - 可開始平行開發使用者故事

---

## Phase 3: User Story 1 - 免費版個人測驗體驗 (優先級: P1) 🎯 MVP

**目標**: 使用者可免費進行 15 題細胞識別測驗，完成後查看基本結果報表（有效期限 7 天）。無需註冊或驗證。

**獨立測試**: 進入首頁 → 選擇免費版 → 選擇測驗類型 → 完成 15 題測驗 → 查看結果報表（7 天內可再次查看）

### 資料實體 (Models)

- [x] T028 [P] [US1] 建立 User 實體 (backend/src/modules/users/entities/user.entity.ts)，包含所有欄位、關聯、驗證規則、索引
- [x] T029 [P] [US1] 建立 Question 實體 (backend/src/modules/questions/entities/question.entity.ts)，支援兩種測驗類型 (末梢血版、骨髓版)
- [x] T030 [P] [US1] 建立 CellImage 實體 (backend/src/modules/questions/entities/cell-image.entity.ts)，每種細胞 10 張圖片
- [x] T031 [P] [US1] 建立 Exam 實體 (backend/src/modules/exams/entities/exam.entity.ts)，包含測驗狀態、版本、題目序列 (JSON)
- [x] T032 [P] [US1] 建立 AnswerRecord 實體 (backend/src/modules/answers/entities/answer-record.entity.ts)，記錄每一題答案與正確性
- [x] T033 [P] [US1] 建立 ResultReport 實體 (backend/src/modules/reports/entities/result-report.entity.ts)，包含正答率、有效期限

### DTO 與驗證

- [x] T034 [P] [US1] 建立 User DTO (backend/src/modules/users/dto/create-user.dto.ts, update-user.dto.ts, user-response.dto.ts)
- [x] T035 [P] [US1] 建立 Exam DTO (backend/src/modules/exams/dto/start-exam.dto.ts, exam-response.dto.ts)
- [x] T036 [P] [US1] 建立 Answer DTO (backend/src/modules/answers/dto/submit-answer.dto.ts)
- [x] T037 [P] [US1] 建立 Report DTO (backend/src/modules/reports/dto/report-response.dto.ts)

### 服務層邏輯

- [x] T038 [US1] 實作 UsersService (backend/src/modules/users/users.service.ts)，提供使用者資訊登錄與查詢功能
- [x] T039 [US1] 實作 QuestionsService (backend/src/modules/questions/questions.service.ts)，從資料庫隨機選取題目
- [x] T040 [US1] 實作隨機出題演算法 (backend/src/modules/exams/exams.service.ts - generateQuestions 方法)，使用 Seed-based Random (參考 research.md R1)
- [x] T041 [US1] 實作 ExamsService (backend/src/modules/exams/exams.service.ts)，處理測驗建立、進度儲存、題目載入邏輯
- [x] T042 [US1] 實作 AnswersService (backend/src/modules/answers/answers.service.ts)，處理答案提交、正確性驗證、進度更新
- [x] T043 [US1] 實作 ReportsService (backend/src/modules/reports/reports.service.ts)，計算正答率、生成結果報表、檢查有效期限

### API 端點 (Controllers)

- [x] T044 [US1] 實作 UsersController (backend/src/modules/users/users.controller.ts)，端點: GET /api/users/profile, PUT /api/users/profile
- [x] T045 [US1] 實作 ExamsController (backend/src/modules/exams/exams.controller.ts)，端點: POST /api/exams/start, GET /api/exams/:id/current
- [x] T046 [US1] 實作 AnswersController (backend/src/modules/answers/answers.controller.ts)，端點: POST /api/answers/submit
- [x] T047 [US1] 實作 ReportsController (backend/src/modules/reports/reports.controller.ts)，端點: GET /api/reports/:id

### 模組整合

- [x] T048 [US1] 建立 UsersModule (backend/src/modules/users/users.module.ts)，註冊 Controller、Service、Repository
- [x] T049 [US1] 建立 QuestionsModule (backend/src/modules/questions/questions.module.ts)
- [x] T050 [US1] 建立 ExamsModule (backend/src/modules/exams/exams.module.ts)
- [x] T051 [US1] 建立 AnswersModule (backend/src/modules/answers/answers.module.ts)
- [x] T052 [US1] 建立 ReportsModule (backend/src/modules/reports/reports.module.ts)

### 資料庫種子資料

- [x] T053 [US1] 建立題庫種子資料腳本 (backend/src/database/seeds/questions.seed.ts)，至少 100 題 (末梢血版 + 骨髓版)
- [x] T054 [US1] 建立細胞圖片種子資料腳本 (backend/src/database/seeds/cell-images.seed.ts)，每種細胞 10 張圖片 (模擬 S3 URL)

### 錯誤處理與驗證

- [x] T055 [US1] 實作測驗狀態驗證邏輯，防止重複作答、返回修改答案 (ExamsService)
- [x] T056 [US1] 實作報表有效期限檢查 (ReportsService)，7 天過期後返回 HTTP 403

**Checkpoint**: 使用者故事 1 (免費版測驗) 應可完整運作並獨立測試

---

## Phase 4: User Story 2 - 使用者資訊登錄與身份驗證 (優先級: P1)

**目標**: 使用者可以註冊帳號並登入系統，在進行測驗前登錄個人資訊 (姓名、email、組織代碼、職種、證照狀態)，系統可識別並自動填入先前登錄的資訊。

**獨立測試**: 註冊帳號 → 登入系統 → 填寫個人資訊 → 提交表單 → 登出 → 再次登入 → 驗證資訊已儲存並自動填入

**註**: 此故事整合了使用者註冊、登入、個人資訊管理等完整的身份驗證流程

### 資料實體增強

- [x] T057 [P] [US2] 擴充 User 實體 (backend/src/modules/users/entities/user.entity.ts)，新增 password (加密)、password_reset_token、password_reset_expires 欄位

### 資料驗證增強

- [x] T058 [P] [US2] 擴充 CreateUserDto (backend/src/modules/users/dto/create-user.dto.ts)，新增 password、organization_code、job_title、certification_status 欄位驗證
- [x] T059 [P] [US2] 建立 Email 格式驗證器 (backend/src/common/validators/email.validator.ts)，遵循 RFC 5322

### 服務層邏輯增強

- [x] T060 [US2] 擴充 UsersService (backend/src/modules/users/users.service.ts)，新增 findByEmail、updateUserInfo、updatePassword 方法
- [x] T061 [US2] 實作使用者資訊自動填入邏輯 (UsersService - getUserProfile 方法)

### 認證流程整合

- [x] T062 [US2] 整合註冊流程 (AuthService - register 方法)，呼叫 UsersService 建立使用者並加密密碼
- [x] T063 [US2] 整合登入流程 (AuthService - login 方法)，驗證密碼並返回 JWT Token
- [x] T064 [US2] 實作 Token 刷新邏輯 (AuthService - refreshToken 方法)，驗證 Refresh Token 並生成新的 Access Token
- [x] T065 [US2] 實作登出邏輯 (AuthService - logout 方法)，將 Token 加入黑名單 (Redis)

### 錯誤處理

- [x] T066 [US2] 實作 Email 重複檢查邏輯 (UsersService)，返回 HTTP 409 如 email 已存在
- [x] T067 [US2] 實作欄位格式錯誤處理 (ValidationPipe)，返回 HTTP 400 與詳細錯誤訊息
- [x] T068 [US2] 實作登入失敗處理 (AuthService)，返回 HTTP 401 如密碼錯誤
- [x] T069 [US2] 實作 Token 無效處理 (JwtAuthGuard)，返回 HTTP 401 如 Token 過期或無效

**Checkpoint**: 使用者故事 1 與 2 皆可獨立運作，完整的註冊登入流程已實作

---

## Phase 5: User Story 6 - 隨機出題與答題機制 (優先級: P1)

**目標**: 確保隨機出題機制正確運作，每題顯示一張隨機細胞照片，一問一答模式，不可返回修改。

**獨立測試**: 觸發題目生成 → 驗證題目隨機性 → 驗證圖片隨機性 → 驗證答題流程 → 驗證不可返回限制

**註**: 此故事的核心邏輯已在 US1 實作 (T040 隨機演算法)，此階段著重於機制完善與邊界測試

### 隨機演算法完善

- [x] T064 [P] [US6] 建立 Seed 生成工具 (backend/src/utils/random.util.ts)，使用 SHA-256 雜湊批次 ID
- [x] T065 [P] [US6] 整合 seedrandom 套件 (npm install seedrandom @types/seedrandom)，實作 Mersenne Twister 演算法
- [x] T066 [US6] 實作圖片隨機選擇邏輯 (ExamsService - selectRandomImage 方法)，每種細胞 10 張圖片隨機選一張

### 答題流程限制

- [x] T067 [US6] 實作答題進度追蹤 (ExamsService - getCurrentQuestion 方法)，記錄當前題號於資料庫
- [x] T068 [US6] 實作禁止返回修改邏輯 (AnswersController)，檢查 question_sequence 是否大於當前進度
- [x] T069 [US6] 實作跳過題目邏輯 (AnswersService - skipQuestion 方法)，自動記錄為答錯

### 快取優化

- [x] T070 [US6] 實作題目序列快取 (ExamsService)，使用 Redis 快取生成的題目組合 (10 天 TTL)
- [x] T071 [US6] 實作批次 ID 快取 (GroupsService)，確保團體測驗題目一致性

### 邊界情況處理

- [x] T072 [US6] 實作題目不足檢查 (QuestionsService - validateQuestionPool 方法)，少於 15/20 題時返回錯誤
- [x] T073 [US6] 實作網路中斷恢復機制 (ExamsService - resumeExam 方法)，從上次進度繼續
- [x] T074 [US6] 實作測驗重複開始防護 (ExamsService - checkExamStatus 方法)，已開始或已完成的測驗返回 HTTP 400

**Checkpoint**: 使用者故事 1, 2, 6 皆可獨立運作，免費版測驗完整功能已實作

---

## Phase 6: User Story 3 - 付費版個人測驗購買與體驗 (優先級: P2)

**目標**: 使用者透過 Stripe 付款購買付費版測驗，完成 OTP 郵件驗證後進行 20 題測驗，獲得進階報表 (有效期限 1 個月)。

**獨立測試**: 選擇付費版 → 完成 Stripe 付款 → 接收並驗證 OTP → 完成 20 題測驗 → 查看進階報表 → 下載 PDF

### 資料實體

- [x] T075 [P] [US3] 建立 PaymentRecord 實體 (backend/src/modules/payments/entities/payment-record.entity.ts)，記錄 Stripe 交易資訊
- [x] T076 [P] [US3] 建立 OTPVerification 實體 (backend/src/modules/otp/entities/otp-verification.entity.ts)，包含驗證碼、嘗試次數、鎖定狀態
- [x] T077 [P] [US3] 建立 Session 實體 (backend/src/modules/auth/entities/session.entity.ts)，記錄裝置指紋與過期時間

### DTO 與驗證

- [x] T078 [P] [US3] 建立 Payment DTO (backend/src/modules/payments/dto/create-checkout.dto.ts, payment-response.dto.ts)
- [x] T079 [P] [US3] 建立 OTP DTO (backend/src/modules/otp/dto/send-otp.dto.ts, verify-otp.dto.ts)

### Stripe 整合

- [x] T080 [US3] 實作 PaymentsService (backend/src/modules/payments/payments.service.ts)，整合 Stripe SDK 建立 Checkout Session
- [ ] T081 [US3] 實作 Stripe Webhook 處理 (PaymentsService - handleWebhook 方法)，驗證簽章 (參考 research.md R3)
- [ ] T082 [US3] 實作付款成功後發送郵件邏輯 (MailService - sendExamLink 方法)

### OTP 驗證機制

- [x] T083 [US3] 實作 OtpService (backend/src/modules/otp/otp.service.ts)，生成 6 位數 OTP (10 分鐘有效)
- [ ] T084 [US3] 實作 OTP 發送邏輯 (OtpService - sendOtp 方法)，整合郵件服務與 Redis 速率限制 (60 秒)
- [ ] T085 [US3] 實作 OTP 驗證邏輯 (OtpService - verifyOtp 方法)，檢查嘗試次數 (10 次) 與鎖定狀態 (5 分鐘)
- [ ] T086 [US3] 實作 OTP 驗證成功後 Session 建立 (AuthService - createSession 方法)，10 天有效期限

### 郵件服務

- [x] T087 [P] [US3] 建立 MailService (backend/src/modules/mail/mail.service.ts)，整合 nodemailer 與 AWS SES
- [x] T088 [P] [US3] 建立 OTP 郵件範本 (backend/src/modules/mail/templates/otp-verification.hbs)，支援多語言
- [x] T089 [P] [US3] 建立測驗連結郵件範本 (backend/src/modules/mail/templates/exam-link.hbs)
- [ ] T090 [US3] 實作郵件發送 Queue (MailService)，使用 Bull Queue + Redis (參考 research.md R2)

### 進階報表功能

- [ ] T091 [US3] 擴充 ReportsService (backend/src/modules/reports/reports.service.ts)，新增統計資訊計算 (其他受測者答案分佈)
- [ ] T092 [US3] 實作統計資訊查詢邏輯 (ReportsService - getAnswerDistribution 方法)，條件: 相同問題與相同圖片
- [ ] T093 [US3] 實作推薦講座資訊整合 (ReportsService - getRecommendedLectures 方法)，系統預設內容

### PDF 報表生成

- [ ] T094 [P] [US3] 建立 PDF 生成服務 (backend/src/modules/reports/services/pdf-generator.service.ts)，使用 pdf-lib 套件
- [ ] T095 [P] [US3] 建立 PDF 報表範本 (backend/src/modules/reports/templates/result-report.template.ts)，包含所有進階資訊
- [ ] T096 [US3] 實作 PDF 生成 Queue (PdfGeneratorService)，背景任務處理 (參考 research.md R4)
- [ ] T097 [US3] 實作 PDF S3 上傳與快取 (StorageService - uploadPdf 方法)，快取 1 個月

### API 端點

- [x] T098 [US3] 實作 PaymentsController (backend/src/modules/payments/payments.controller.ts)，端點: POST /api/payments/create-checkout, POST /api/payments/webhook
- [x] T099 [US3] 實作 OtpController (backend/src/modules/otp/otp.controller.ts)，端點: POST /api/otp/send, POST /api/otp/verify
- [ ] T100 [US3] 擴充 ReportsController (backend/src/modules/reports/reports.controller.ts)，新增 GET /api/reports/:id/pdf 端點

### 模組整合

- [x] T101 [US3] 建立 PaymentsModule (backend/src/modules/payments/payments.module.ts)
- [x] T102 [US3] 建立 OtpModule (backend/src/modules/otp/otp.module.ts)
- [x] T103 [US3] 建立 MailModule (backend/src/modules/mail/mail.module.ts)
- [ ] T104 [US3] 建立 StorageModule (backend/src/modules/storage/storage.module.ts)，整合 AWS S3

### 會話管理

- [ ] T105 [US3] 實作裝置指紋追蹤 (AuthService - generateDeviceFingerprint 方法)，使用 User-Agent + IP
- [ ] T106 [US3] 實作會話驗證中間件 (SessionGuard - backend/src/common/guards/session.guard.ts)，檢查 10 天有效期限
- [ ] T107 [US3] 實作會話自動延期邏輯 (AuthService - renewSession 方法)

### 錯誤處理

- [ ] T108 [US3] 實作 Stripe 付款失敗處理 (PaymentsService)，返回 HTTP 400 與錯誤訊息
- [ ] T109 [US3] 實作 OTP 錯誤處理 (OtpService)，返回 HTTP 400 (錯誤/過期) 或 HTTP 429 (速率限制/鎖定)
- [ ] T110 [US3] 實作會話過期處理 (SessionGuard)，返回 HTTP 401 與身份驗證連結
- [ ] T111 [US3] 實作 PDF 生成失敗處理 (PdfGeneratorService)，重試 3 次後記錄錯誤

**Checkpoint**: 使用者故事 1, 2, 3, 6 皆可獨立運作，付費版個人測驗完整功能已實作

---

## Phase 7: User Story 4 - 團體測驗購買與管理 (優先級: P2)

**目標**: 管理者購買指定人數的團體測驗，完成 OTP 驗證後設定受測者清單，追蹤所有受測者的測驗狀態和結果。

**獨立測試**: 購買團體測驗 → 管理者 OTP 驗證 → 設定受測者清單 → 發送測驗連結 → 追蹤受測狀態 → 查看團體統計

### 資料實體

- [ ] T112 [P] [US4] 建立 GroupExamBatch 實體 (backend/src/modules/groups/entities/group-exam-batch.entity.ts)，包含管理者資訊、購買人數、題目組合、管理 Token、查看期限

### DTO 與驗證

- [ ] T113 [P] [US4] 建立 Group DTO (backend/src/modules/groups/dto/create-batch.dto.ts, configure-takers.dto.ts, batch-response.dto.ts)

### 服務層邏輯

- [ ] T114 [US4] 實作 GroupsService (backend/src/modules/groups/groups.service.ts)，處理批次建立、受測者設定、進度追蹤
- [ ] T115 [US4] 實作批次題目生成邏輯 (GroupsService - generateBatchQuestions 方法)，使用批次 ID 作為 Seed (參考 research.md R1)
- [ ] T116 [US4] 實作管理 Token 生成 (GroupsService - generateAdminToken 方法)，UUID + 簽章驗證
- [ ] T117 [US4] 實作受測者邀請邏輯 (GroupsService - inviteTakers 方法)，批次發送測驗連結郵件

### 管理後台功能

- [ ] T118 [US4] 實作管理後台查詢邏輯 (GroupsService - getBatchStatus 方法)，顯示所有受測者姓名、受測日期、正答率
- [ ] T119 [US4] 實作團體統計計算 (GroupsService - calculateGroupStats 方法)，計算團體整體正答率
- [ ] T120 [US4] 實作管理後台權限驗證 (AdminGuard - backend/src/common/guards/admin.guard.ts)，檢查管理 Token 與 Session (1 小時)

### 郵件服務擴充

- [ ] T121 [P] [US4] 建立管理頁面連結郵件範本 (backend/src/modules/mail/templates/admin-link.hbs)
- [ ] T122 [P] [US4] 建立受測者邀請郵件範本 (backend/src/modules/mail/templates/taker-invitation.hbs)
- [ ] T123 [US4] 實作批次郵件發送邏輯 (MailService - sendBatchInvitations 方法)

### API 端點

- [ ] T124 [US4] 實作 GroupsController (backend/src/modules/groups/groups.controller.ts)，端點: POST /api/groups/batches (購買), POST /api/groups/batches/:id/configure (設定受測者), GET /api/groups/batches/:id (管理後台)
- [ ] T125 [US4] 擴充 PaymentsController (backend/src/modules/payments/payments.controller.ts)，新增團體測驗付款邏輯

### 模組整合

- [ ] T126 [US4] 建立 GroupsModule (backend/src/modules/groups/groups.module.ts)

### 會話管理 (管理者)

- [ ] T127 [US4] 實作管理者會話邏輯 (AuthService - createAdminSession 方法)，1 小時無操作過期
- [ ] T128 [US4] 實作管理者會話自動過期 (SessionGuard)，過期後要求重新 OTP 驗證

### 錯誤處理

- [ ] T129 [US4] 實作管理頁面無效處理 (GroupsService)，返回 HTTP 404
- [ ] T130 [US4] 實作管理頁面過期處理 (GroupsService)，查看期限 (1 個月) 過期返回 HTTP 403
- [ ] T131 [US4] 實作受測者人數超過購買份數檢查 (GroupsService)，返回 HTTP 400

**Checkpoint**: 使用者故事 1, 2, 3, 4, 6 皆可獨立運作，團體測驗管理功能已實作

---

## Phase 8: User Story 5 - 團體測驗受測者體驗 (優先級: P2)

**目標**: 受測者收到測驗連結後完成 OTP 驗證並進行測驗 (與團體內其他人相同題目)，完成後查看個人結果及團體統計。

**獨立測試**: 接收測驗連結 → 完成 OTP 驗證 → 進行測驗 → 查看個人結果及團體統計 → 驗證題目一致性

### 服務層邏輯擴充

- [ ] T132 [US5] 擴充 ExamsService (backend/src/modules/exams/exams.service.ts)，新增團體測驗邏輯 (使用批次題目組合)
- [ ] T133 [US5] 實作測驗連結 Token 驗證 (ExamsService - validateExamToken 方法)，檢查有效期限 (10 天)
- [ ] T134 [US5] 實作答題進度恢復邏輯 (ExamsService - resumeTakerExam 方法)，會話過期或更換裝置時重新驗證後恢復

### 提醒郵件功能

- [ ] T135 [P] [US5] 建立提醒郵件範本 (backend/src/modules/mail/templates/exam-reminder.hbs)
- [ ] T136 [US5] 實作每日提醒郵件排程 (MailService - scheduleReminders 方法)，使用 @nestjs/schedule 套件
- [ ] T137 [US5] 實作提醒郵件發送條件檢查 (MailService - shouldSendReminder 方法)，未完成測驗且未過期

### 團體統計功能

- [ ] T138 [US5] 擴充 ReportsService (backend/src/modules/reports/reports.service.ts)，新增團體比較統計 (個人正答率 vs 團體平均)
- [ ] T139 [US5] 實作團體統計查詢邏輯 (ReportsService - getGroupComparison 方法)

### 受測者會話管理

- [ ] T140 [US5] 實作受測者會話邏輯 (AuthService - createTakerSession 方法)，10 天有效期限
- [ ] T141 [US5] 實作會話中斷恢復機制 (SessionGuard)，同一裝置/瀏覽器內恢復進度

### API 端點擴充

- [ ] T142 [US5] 擴充 ExamsController (backend/src/modules/exams/exams.controller.ts)，新增 POST /api/exams/group/start 端點 (受測者開始測驗)
- [ ] T143 [US5] 擴充 ReportsController (backend/src/modules/reports/reports.controller.ts)，新增 GET /api/reports/:id/group-stats 端點

### 錯誤處理

- [ ] T144 [US5] 實作測驗連結無效處理 (ExamsService)，返回 HTTP 404
- [ ] T145 [US5] 實作測驗連結過期處理 (ExamsService)，10 天過期返回 HTTP 403
- [ ] T146 [US5] 實作測驗進行中期限到期邏輯 (ExamsService)，允許完成當前測驗但之後無法再次進入

### 排程任務

- [ ] T147 [US5] 實作提醒郵件排程任務 (MailService - @Cron('0 9 \* \* \*') dailyReminderJob)，每天早上 9 點執行
- [ ] T148 [US5] 實作過期測驗清理任務 (ExamsService - @Cron('0 2 \* \* \*') cleanupExpiredExams)，每天凌晨 2 點執行

**Checkpoint**: 所有使用者故事 (1-6) 皆可獨立運作，完整系統功能已實作

---

## Phase 9: Polish & Cross-Cutting Concerns (跨模組優化)

**目的**: 改善影響多個使用者故事的共用功能

### 多語言支援 (i18n)

- [ ] T149 [P] 安裝 nestjs-i18n 套件 (npm install nestjs-i18n)
- [ ] T150 [P] 建立多語言配置 (backend/src/config/i18n.config.ts)，支援繁體中文、英文、日文
- [ ] T151 [P] 建立翻譯檔案 (backend/src/i18n/zh-TW/messages.json, en/messages.json, ja/messages.json)
- [ ] T152 整合 i18n 至錯誤訊息 (HttpExceptionFilter)
- [ ] T153 整合 i18n 至郵件範本 (MailService)

### Swagger API 文檔

- [ ] T154 [P] 完善 Swagger 註解 (所有 Controller)，包含請求/回應範例、錯誤碼說明
- [ ] T155 [P] 設定 Swagger UI 配置 (backend/src/main.ts)，包含認證、分組、標籤

### 效能優化

- [ ] T156 [P] 實作資料庫查詢索引優化，確認所有外鍵、查詢欄位皆有索引
- [ ] T157 [P] 實作 N+1 查詢優化，使用 TypeORM eager loading 或 QueryBuilder
- [ ] T158 實作 Redis 快取策略，快取題庫、報表統計資訊
- [ ] T159 實作 API 回應壓縮 (compression middleware)

### 安全強化

- [ ] T160 [P] 實作 Rate Limiting (throttler)，防止 API 濫用
- [ ] T161 [P] 實作 CORS 配置 (backend/src/main.ts)，限制允許的來源
- [ ] T162 [P] 實作 Helmet 安全標頭 (npm install helmet)
- [ ] T163 實作敏感資訊遮罩 (LoggingInterceptor)，不記錄密碼、OTP、Token

### 監控與日誌

- [ ] T164 [P] 整合 Winston 日誌框架 (npm install nest-winston winston)
- [ ] T165 [P] 設定日誌分級 (error, warn, info, debug)
- [ ] T166 實作慢查詢日誌 (TypeORM logging)
- [ ] T167 實作錯誤追蹤 (Sentry / DataDog 整合)

### 文檔與部署

- [ ] T168 [P] 更新 README.md，包含專案概述、安裝指南、API 文檔連結
- [ ] T169 [P] 驗證 quickstart.md 所有步驟可正常執行
- [ ] T170 [P] 建立部署文檔 (docs/deployment.md)，包含環境變數、資料庫遷移、Docker 部署步驟
- [ ] T171 程式碼清理與重構，移除未使用的匯入、註解、測試程式碼

### 資料庫遷移

- [ ] T172 生成最終資料庫遷移檔案 (npm run migration:generate)
- [ ] T173 驗證遷移檔案可正確執行 (npm run migration:run)

---

## Dependencies & Execution Order (依賴關係與執行順序)

### 階段依賴

- **Setup (Phase 1)**: 無依賴 - 可立即開始
- **Foundational (Phase 2)**: 依賴 Setup 完成 - **阻擋所有使用者故事**
- **User Stories (Phase 3-8)**: 全部依賴 Foundational 完成
  - 完成 Foundational 後，可平行開發使用者故事 (如有足夠人力)
  - 或按優先級順序開發 (P1 → P2)
- **Polish (Phase 9)**: 依賴所有需要的使用者故事完成

### 使用者故事依賴

- **User Story 1 (P1)**: Foundational 完成後即可開始 - 無依賴其他故事
- **User Story 2 (P1)**: Foundational 完成後即可開始 - 擴充 US1 的 User 實體
- **User Story 6 (P1)**: Foundational 完成後即可開始 - 完善 US1 的隨機出題機制
- **User Story 3 (P2)**: 依賴 US1, US2 完成 - 擴充測驗邏輯與報表功能
- **User Story 4 (P2)**: 依賴 US3 完成 - 複用付費版邏輯
- **User Story 5 (P2)**: 依賴 US4 完成 - 受測者端邏輯

### 建議執行順序

**MVP 優先 (最小可行產品)**:

1. Phase 1: Setup → Phase 2: Foundational
2. Phase 3: US1 (免費版測驗) → 驗證 → 部署/展示
3. Phase 4: US2 (使用者資訊登錄) → 驗證
4. Phase 5: US6 (隨機出題機制完善) → 驗證
5. **MVP 完成**: 可展示完整免費版測驗流程

**增量交付**:

1. 完成 MVP (US1+US2+US6)
2. Phase 6: US3 (付費版個人測驗) → 驗證 → 部署
3. Phase 7: US4 (團體測驗管理) → 驗證 → 部署
4. Phase 8: US5 (團體受測者體驗) → 驗證 → 部署
5. Phase 9: Polish (優化與強化)

**平行團隊策略** (如有多位開發者):

1. 團隊共同完成 Setup + Foundational
2. Foundational 完成後平行開發:
   - 開發者 A: US1 + US2 + US6 (免費版)
   - 開發者 B: US3 (付費版個人)
   - 開發者 C: US4 + US5 (團體測驗)
3. 各故事完成後獨立驗證與整合

### 故事內部依賴

每個使用者故事內部遵循以下順序:

1. 資料實體 (Models) → 優先建立，其他皆依賴
2. DTO & 驗證 → 與 Models 平行開發
3. 服務層邏輯 (Services) → 依賴 Models 與 DTO
4. API 端點 (Controllers) → 依賴 Services
5. 模組整合 (Modules) → 依賴所有元件
6. 錯誤處理 → 整合至各層

### 平行執行機會

- **Setup (Phase 1)**: 標記 [P] 的任務可平行執行 (T003, T004, T005, T006, T007)
- **Foundational (Phase 2)**: 標記 [P] 的任務可平行執行 (例如: T011-T015 認證相關, T016-T020 API 架構, T021-T024 外部服務)
- **使用者故事**: Foundational 完成後，所有使用者故事可平行開始 (如團隊容量允許)
- **故事內部**: 同一故事內標記 [P] 的任務可平行執行 (例如: US1 的 T028-T033 所有實體, T034-T037 所有 DTO)

---

## Parallel Example: User Story 1 (平行執行範例)

```bash
# 階段 1: 所有資料實體可同時建立
Task T028: "建立 User 實體 in backend/src/modules/users/entities/user.entity.ts"
Task T029: "建立 Question 實體 in backend/src/modules/questions/entities/question.entity.ts"
Task T030: "建立 CellImage 實體 in backend/src/modules/questions/entities/cell-image.entity.ts"
Task T031: "建立 Exam 實體 in backend/src/modules/exams/entities/exam.entity.ts"
Task T032: "建立 AnswerRecord 實體 in backend/src/modules/answers/entities/answer-record.entity.ts"
Task T033: "建立 ResultReport 實體 in backend/src/modules/reports/entities/result-report.entity.ts"

# 階段 2: 所有 DTO 可同時建立
Task T034: "建立 User DTO in backend/src/modules/users/dto/"
Task T035: "建立 Exam DTO in backend/src/modules/exams/dto/"
Task T036: "建立 Answer DTO in backend/src/modules/answers/dto/"
Task T037: "建立 Report DTO in backend/src/modules/reports/dto/"

# 階段 3: 種子資料可同時建立
Task T053: "建立題庫種子資料 in backend/src/database/seeds/questions.seed.ts"
Task T054: "建立細胞圖片種子資料 in backend/src/database/seeds/cell-images.seed.ts"
```

---

## Implementation Strategy (實作策略)

### MVP 優先 (僅 User Story 1, 2, 6)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational (**關鍵** - 阻擋所有故事)
3. 完成 Phase 3: User Story 1 (免費版測驗)
4. 完成 Phase 4: User Story 2 (使用者資訊登錄)
5. 完成 Phase 5: User Story 6 (隨機出題機制)
6. **停止並驗證**: 獨立測試免費版完整流程
7. 部署/展示 MVP

### 增量交付 (Incremental Delivery)

1. Setup + Foundational → 基礎建設完成
2. 新增 US1+US2+US6 → 獨立測試 → 部署/展示 (**MVP!**)
3. 新增 US3 → 獨立測試 → 部署/展示 (付費版個人)
4. 新增 US4 → 獨立測試 → 部署/展示 (團體管理)
5. 新增 US5 → 獨立測試 → 部署/展示 (團體受測者)
6. Polish → 優化 → 最終部署

每個故事增加價值，不影響先前故事的運作。

### 平行團隊策略 (Parallel Team Strategy)

如有多位開發者:

1. 團隊共同完成 Setup + Foundational
2. Foundational 完成後:
   - 開發者 A: User Story 1 + 2 + 6 (免費版)
   - 開發者 B: User Story 3 (付費版個人)
   - 開發者 C: User Story 4 + 5 (團體測驗)
3. 各故事完成後獨立驗證與整合

---

## Summary (摘要)

- **總任務數**: 187 個任務 (新增 14 個登入註冊相關任務)
- **使用者故事數**: 6 個 (US1, US2, US3, US4, US5, US6)
- **優先級分布**: P1 = 3 個故事 (US1, US2, US6), P2 = 3 個故事 (US3, US4, US5)
- **平行任務數**: 約 70 個任務標記為 [P]，可同時執行
- **建議 MVP 範圍**: Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US2) + Phase 5 (US6) = 約 88 個任務
- **預估工時**: MVP 約 3-4 週 (1 位開發者)，完整專案約 6-8 週

### 任務統計 (Tasks per User Story)

- **Setup**: 8 個任務
- **Foundational**: 30 個任務 (+11 個認證與密碼管理任務)
- **US1 (免費版測驗)**: 29 個任務
- **US2 (使用者資訊與身份驗證)**: 13 個任務 (+6 個認證整合任務)
- **US6 (隨機出題)**: 11 個任務
- **US3 (付費版個人)**: 37 個任務
- **US4 (團體管理)**: 20 個任務
- **US5 (團體受測者)**: 17 個任務
- **Polish**: 25 個任務

### 新增任務明細 (登入註冊功能)

**Phase 2 - Foundational 新增**:

- T015a: Auth DTO (register.dto.ts, login.dto.ts)
- T015b: AuthService 核心邏輯
- T015c: 密碼加密服務 (bcrypt)
- T015d: Local 策略 (密碼驗證)
- T015e: AuthController (8 個端點: 註冊、登入、登出、刷新、取得當前使用者、忘記密碼、重設密碼、變更密碼)
- T015f: AuthModule 模組整合
- T027a: PasswordResetToken 實體
- T027b: 忘記密碼邏輯
- T027c: 重設密碼邏輯
- T027d: 變更密碼邏輯
- T027e: 密碼重設郵件範本

**Phase 4 - US2 擴充**:

- T057: User 實體新增密碼相關欄位
- T062: 整合註冊流程
- T063: 整合登入流程
- T064: Token 刷新邏輯
- T065: 登出邏輯
- T068: 登入失敗處理
- T069: Token 無效處理

### 平行執行機會

- **Setup 階段**: 5 個任務可平行 (T003-T007)
- **Foundational 階段**: 18 個任務可平行 (+6 個認證相關任務: T015a-T015d, T027a, T027e)
- **US1 階段**: 15 個任務可平行 (所有實體、所有 DTO、種子資料)
- **US2 階段**: 3 個任務可平行 (T057, T058, T059)
- **US3 階段**: 10 個任務可平行 (實體、DTO、郵件範本、PDF 範本)
- **US4 階段**: 3 個任務可平行 (DTO、郵件範本)
- **US5 階段**: 1 個任務可平行 (郵件範本)
- **Polish 階段**: 10 個任務可平行 (多語言、Swagger、索引、監控)

### 獨立測試標準

每個使用者故事皆可獨立測試:

- **US1**: 完整免費版測驗流程 (15 題)
- **US2**: 使用者註冊、登入、資訊登錄、自動填入、密碼管理
- **US6**: 隨機出題機制與答題限制
- **US3**: 付費版購買、OTP 驗證、進階報表、PDF 下載
- **US4**: 團體測驗購買、管理者設定、追蹤受測狀態
- **US5**: 受測者邀請、測驗進行、團體統計

---

## Notes (備註)

- **[P] 任務**: 不同檔案、無相依性，可平行執行
- **[Story] 標籤**: 將任務映射至特定使用者故事，便於追蹤
- **每個使用者故事**: 應可獨立完成與測試
- **測試策略**: 本專案規格未要求 TDD，但建議於 Phase 9 新增單元測試與 E2E 測試
- **提交頻率**: 每完成一個任務或邏輯組合即提交
- **Checkpoint**: 在每個 Checkpoint 停下驗證故事獨立運作
- **避免**: 模糊任務、相同檔案衝突、破壞獨立性的跨故事依賴

---

## 下一步

1. 執行 `docker-compose up -d` 啟動開發環境 (MySQL + Redis)
2. 按照 quickstart.md 設定環境變數與資料庫
3. 按照 Phase 1 → Phase 2 → Phase 3 順序開始實作
4. 每完成一個 Phase 執行 Checkpoint 驗證
5. 完成 MVP (US1+US2+US6) 後部署展示

**祝開發順利！** 🚀
