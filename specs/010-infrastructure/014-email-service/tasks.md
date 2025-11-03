# 任務清單：郵件服務系統

**輸入**: 設計文件來自 `/specs/010-infrastructure/014-email-service/`
**前置條件**: plan.md (必要), spec.md (必要，用於使用者故事), research.md, data-model.md, contracts/

**組織方式**: 任務按使用者故事分組，以實現每個故事的獨立實作和測試。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可平行執行（不同檔案，無依賴性）
- **[Story]**: 此任務屬於哪個使用者故事（例如 US1, US2, US3）
- 描述中包含確切的檔案路徑

## 路徑慣例

基於計畫文件，使用單一專案結構：`src/email/`, `tests/email/` 位於儲存庫根目錄

## 第1階段：設置（共享基礎架構）

**目的**: 專案初始化和基本結構

- [ ] T001 根據實作計畫建立郵件服務模組專案結構
- [ ] T002 初始化郵件服務依賴項（Nodemailer, Bull Queue, Handlebars）
- [ ] T003 [P] 配置 AWS SES、SendGrid 和其他郵件服務商套件
- [ ] T004 [P] 設置 Jest 和 MailHog 測試郵件伺服器
- [ ] T005 [P] 配置郵件模板和測試資料

---

## 第2階段：基礎建設（阻塞前置條件）

**目的**: 所有使用者故事實作前必須完成的核心基礎架構

**⚠️ 關鍵**: 在此階段完成前，無法開始任何使用者故事工作

- [ ] T006 設置 Redis 連線配置用於郵件佇列
- [ ] T007 設置 PostgreSQL 連線用於發送記錄和統計
- [ ] T008 [P] 建立郵件相關的 TypeScript 型別定義在 src/email/types/
- [ ] T009 [P] 實作基礎模板工具在 src/email/utils/templateUtils.ts
- [ ] T010 [P] 實作郵件驗證工具在 src/email/utils/validationUtils.ts
- [ ] T011 [P] 實作發送工具在 src/email/utils/deliveryUtils.ts
- [ ] T012 建立郵件服務提供者基礎架構在 src/email/providers/
- [ ] T013 建立郵件錯誤處理和日誌記錄基礎架構
- [ ] T014 配置 Bull Queue 和排程任務基礎架構

**檢查點**: 基礎建設就緒 - 使用者故事實作現在可以平行開始

---

## 第3階段：使用者故事1 - 快速可靠的OTP郵件發送 (優先級: P1) 🎯 MVP

**目標**: 系統能夠在30秒內將OTP認證碼郵件送達用戶信箱，確保認證流程順暢

**獨立測試**: 觸發OTP發送請求並監控郵件送達時間

### 使用者故事1實作

- [ ] T015 [P] [US1] 建立 EmailRecord 模型在 src/email/models/EmailRecord.ts
- [ ] T016 [P] [US1] 建立 EmailQueue 模型在 src/email/models/EmailQueue.ts
- [ ] T017 [P] [US1] 建立 OTP 郵件模板在 src/email/templates/otp/otp-email.hbs
- [ ] T018 [P] [US1] 建立基礎佈局模板在 src/email/templates/shared/base-layout.hbs
- [ ] T019 [US1] 實作 EmailService 在 src/email/services/EmailService.ts（依賴 T015, T016）
- [ ] T020 [US1] 實作 QueueService 在 src/email/services/QueueService.ts
- [ ] T021 [US1] 實作 TemplateService 在 src/email/services/TemplateService.ts
- [ ] T022 [US1] 實作基礎郵件提供者在 src/email/providers/SMTPProvider.ts
- [ ] T023 [US1] 實作郵件控制器在 src/email/controllers/EmailController.ts
- [ ] T024 [US1] 實作郵件處理任務在 src/email/jobs/emailProcessor.ts
- [ ] T025 [US1] 加入 OTP 郵件發送的基本監控和日誌

**檢查點**: 此時使用者故事1應該完全功能正常且可獨立測試

---

## 第4階段：使用者故事2 - 多樣化測驗相關郵件服務 (優先級: P1)

**目標**: 系統支援各種測驗相關場景的郵件發送，包含購買確認、測驗連結配布、結果通知

**獨立測試**: 模擬各種測驗場景來驗證不同類型郵件的發送和呈現效果

### 使用者故事2實作

- [ ] T026 [P] [US2] 建立購買確認郵件模板在 src/email/templates/purchase/purchase-confirmation.hbs
- [ ] T027 [P] [US2] 建立測驗邀請郵件模板在 src/email/templates/test/test-invitation.hbs
- [ ] T028 [P] [US2] 建立測驗提醒郵件模板在 src/email/templates/test/test-reminder.hbs
- [ ] T029 [P] [US2] 建立頁首頁尾共用模板在 src/email/templates/shared/header.hbs 和 footer.hbs
- [ ] T030 [US2] 擴展 TemplateService 支援多種郵件類型
- [ ] T031 [US2] 實作 DeliveryService 在 src/email/services/DeliveryService.ts
- [ ] T032 [US2] 實作批次郵件發送邏輯
- [ ] T033 [US2] 實作郵件排程和延遲發送功能
- [ ] T034 [US2] 加入測驗相關郵件的動態內容填充
- [ ] T035 [US2] 實作郵件發送狀態追蹤

**檢查點**: 此時使用者故事1和2都應該獨立運作

---

## 第5階段：使用者故事3 - 智能郵件模板與品牌管理 (優先級: P2)

**目標**: 系統提供靈活的郵件模板管理功能，支援品牌元素客製化、多語言內容、動態內容填充

**獨立測試**: 配置不同模板和測試各種動態內容來驗證模板系統的靈活性

### 使用者故事3實作

- [ ] T036 [P] [US3] 建立 EmailTemplate 模型在 src/email/models/EmailTemplate.ts
- [ ] T037 [P] [US3] 建立 SendingStats 模型在 src/email/models/SendingStats.ts
- [ ] T038 [P] [US3] 建立 ProviderConfig 模型在 src/email/models/ProviderConfig.ts
- [ ] T039 [US3] 實作模板控制器在 src/email/controllers/TemplateController.ts
- [ ] T040 [US3] 實作統計控制器在 src/email/controllers/StatsController.ts
- [ ] T041 [US3] 實作品牌化和客製化邏輯
- [ ] T042 [US3] 實作多語言模板支援（日文本地化標記）
- [ ] T043 [US3] 實作動態內容和個人化功能
- [ ] T044 [US3] 實作模板版本控制和更新機制
- [ ] T045 [US3] 加入模板預覽和測試功能

**檢查點**: 所有使用者故事現在都應該獨立功能正常

---

## 第6階段：完善與橫切關注點

**目的**: 影響多個使用者故事的改進

- [ ] T046 [P] 實作 AWS SES 提供者在 src/email/providers/AWSProvider.ts
- [ ] T047 [P] 實作 SendGrid 提供者在 src/email/providers/SendGridProvider.ts
- [ ] T048 [P] 實作多重服務商故障轉移邏輯
- [ ] T049 [P] 實作郵件送達狀態更新任務在 src/email/jobs/deliveryStatusUpdate.ts
- [ ] T050 [P] 實作統計聚合任務在 src/email/jobs/statsAggregation.ts
- [ ] T051 [P] 實作速率限制和發送頻率控制
- [ ] T052 [P] 實作垃圾郵件防護機制
- [ ] T053 程式碼清理和重構優化
- [ ] T054 [P] 效能優化和大量發送測試
- [ ] T055 [P] 安全強化和資料保護
- [ ] T056 [P] API 文件更新和監控整合

---

## 依賴關係與執行順序

### 階段依賴關係

- **設置（第1階段）**: 無依賴 - 可立即開始
- **基礎建設（第2階段）**: 依賴設置完成 - 阻塞所有使用者故事
- **使用者故事（第3階段+）**: 全部依賴基礎建設階段完成
  - 使用者故事可以平行進行（如果有人力）
  - 或按優先順序依序進行（P1 → P2 → P3）
- **完善（最終階段）**: 依賴所有需要的使用者故事完成

### 使用者故事依賴關係

- **使用者故事1（P1）**: 基礎建設後可開始 - 對其他故事無依賴
- **使用者故事2（P1）**: 基礎建設後可開始 - 擴展US1但可獨立測試
- **使用者故事3（P2）**: 基礎建設後可開始 - 依賴US1的模板系統但可獨立測試

### 每個使用者故事內部

- 模型在服務之前
- 模板在模板服務之前
- 服務在控制器之前
- 核心實作在任務處理之前
- 故事完成後才移到下一優先順序

### 平行執行機會

- 所有標記[P]的設置任務可平行執行
- 所有標記[P]的基礎建設任務可平行執行（在第2階段內）
- 基礎建設階段完成後，US1和US2可平行開始（都是P1優先級）
- 故事內標記[P]的模型和模板可平行執行
- 不同使用者故事可由不同團隊成員平行工作

---

## 平行執行範例：使用者故事1

```bash
# 同時啟動使用者故事1的所有模型和模板：
任務: "建立 EmailRecord 模型在 src/email/models/EmailRecord.ts"
任務: "建立 EmailQueue 模型在 src/email/models/EmailQueue.ts"
任務: "建立 OTP 郵件模板在 src/email/templates/otp/otp-email.hbs"
任務: "建立基礎佈局模板在 src/email/templates/shared/base-layout.hbs"
```

---

## 實作策略

### MVP優先（使用者故事1和2）

1. 完成第1階段：設置
2. 完成第2階段：基礎建設（關鍵 - 阻塞所有故事）
3. 完成第3和4階段：使用者故事1和2（都是P1優先級）
4. **停止並驗證**: 獨立測試基本郵件發送功能
5. 如果準備好就部署/展示

### 漸進式交付

1. 完成設置 + 基礎建設 → 基礎就緒
2. 加入使用者故事1 → 獨立測試 → 部署/展示（基本MVP）
3. 加入使用者故事2 → 獨立測試 → 部署/展示（多場景版）
4. 加入使用者故事3 → 獨立測試 → 部署/展示（品牌化版）
5. 每個故事都在不破壞先前故事的情況下增加價值

### 平行團隊策略

有多個開發者時：

1. 團隊一起完成設置 + 基礎建設
2. 基礎建設完成後：
   - 開發者A：使用者故事1
   - 開發者B：使用者故事2
   - 開發者C：使用者故事3（US1完成後）
3. 故事獨立完成和整合

---

## 注意事項

- [P] 任務 = 不同檔案，無依賴性
- [Story] 標籤將任務對應到特定使用者故事以便追溯
- 每個使用者故事應該能夠獨立完成和測試
- 郵件發送需要處理各種服務商的API限制和速率控制
- 模板設計需要考慮各種郵件客戶端的相容性
- 每個任務或邏輯群組後提交
- 在任何檢查點停止以獨立驗證故事
- 避免：模糊任務、相同檔案衝突、破壞獨立性的跨故事依賴