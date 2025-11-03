# 任務清單：Stripe 付款整合

**輸入**: 設計文件來自 `/specs/010-infrastructure/015-payment-integration/`
**前置條件**: plan.md (必要), spec.md (必要，用於使用者故事), research.md, data-model.md, contracts/

**組織方式**: 任務按使用者故事分組，以實現每個故事的獨立實作和測試。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可平行執行（不同檔案，無依賴性）
- **[Story]**: 此任務屬於哪個使用者故事（例如 US1, US2, US3）
- 描述中包含確切的檔案路徑

## 路徑慣例

基於計畫文件，使用單一專案結構：`src/payment/`, `tests/payment/` 位於儲存庫根目錄

## 第1階段：設置（共享基礎架構）

**目的**: 專案初始化和基本結構

- [ ] T001 根據實作計畫建立付款服務模組專案結構
- [ ] T002 初始化付款服務依賴項（Stripe SDK, Express.js, Decimal.js）
- [ ] T003 [P] 配置 Stripe 測試環境和 API 金鑰管理
- [ ] T004 [P] 設置 Jest 和 Stripe Mock Server 測試環境
- [ ] T005 [P] 配置付款測試資料和模擬場景

---

## 第2階段：基礎建設（阻塞前置條件）

**目的**: 所有使用者故事實作前必須完成的核心基礎架構

**⚠️ 關鍵**: 在此階段完成前，無法開始任何使用者故事工作

- [ ] T006 設置 PostgreSQL 連線用於訂單和交易記錄
- [ ] T007 設置 Redis 連線用於付款狀態快取
- [ ] T008 [P] 建立付款相關的 TypeScript 型別定義在 src/payment/types/
- [ ] T009 [P] 實作價格計算工具在 src/payment/utils/priceCalculationUtils.ts
- [ ] T010 [P] 實作幣別處理工具在 src/payment/utils/currencyUtils.ts
- [ ] T011 [P] 實作發票工具在 src/payment/utils/invoiceUtils.ts
- [ ] T012 [P] 實作審計工具在 src/payment/utils/auditUtils.ts
- [ ] T013 建立 Stripe 整合基礎架構在 src/payment/integrations/
- [ ] T014 建立付款錯誤處理和日誌記錄基礎架構
- [ ] T015 配置 Stripe Webhook 驗證和處理架構

**檢查點**: 基礎建設就緒 - 使用者故事實作現在可以平行開始

---

## 第3階段：使用者故事1 - 個人版安全快速付款 (優先級: P1) 🎯 MVP

**目標**: 個人用戶能夠透過Stripe安全地完成付費測驗購買，整個付款流程簡潔明瞭

**獨立測試**: 完整的選購、付款、確認流程能正常運作

### 使用者故事1實作

- [ ] T016 [P] [US1] 建立 OrderRecord 模型在 src/payment/models/OrderRecord.ts
- [ ] T017 [P] [US1] 建立 PaymentTransaction 模型在 src/payment/models/PaymentTransaction.ts
- [ ] T018 [P] [US1] 建立 ProductConfig 模型在 src/payment/models/ProductConfig.ts
- [ ] T019 [P] [US1] 實作付款驗證器在 src/payment/validators/paymentValidators.ts
- [ ] T020 [US1] 實作 PaymentService 在 src/payment/services/PaymentService.ts（依賴 T016-T018）
- [ ] T021 [US1] 實作 OrderService 在 src/payment/services/OrderService.ts
- [ ] T022 [US1] 實作 StripeClient 在 src/payment/integrations/StripeClient.ts
- [ ] T023 [US1] 實作付款控制器在 src/payment/controllers/PaymentController.ts
- [ ] T024 [US1] 實作訂單控制器在 src/payment/controllers/OrderController.ts
- [ ] T025 [US1] 實作付款安全中介軟體在 src/payment/middleware/paymentSecurityMiddleware.ts
- [ ] T026 [US1] 加入個人版付款流程的基本日誌和監控

**檢查點**: 此時使用者故事1應該完全功能正常且可獨立測試

---

## 第4階段：使用者故事2 - 團體版批量付款與管理 (優先級: P1)

**目標**: 團體版購買者能夠根據受測者人數進行批量付款，系統自動計算總價

**獨立測試**: 設定不同人數的團體測驗並完成付款流程

### 使用者故事2實作

- [ ] T027 [P] [US2] 建立訂單驗證器在 src/payment/validators/orderValidators.ts
- [ ] T028 [P] [US2] 實作重複付款防護中介軟體在 src/payment/middleware/duplicatePaymentMiddleware.ts
- [ ] T029 [US2] 實作 PricingService 在 src/payment/services/PricingService.ts
- [ ] T030 [US2] 擴展 PaymentService 支援團體版批量付款
- [ ] T031 [US2] 實作 Stripe Webhook 處理器在 src/payment/integrations/StripeWebhookHandler.ts
- [ ] T032 [US2] 實作 Stripe 事件處理器在 src/payment/integrations/StripeEventProcessor.ts
- [ ] T033 [US2] 實作團體版價格計算和驗證邏輯
- [ ] T034 [US2] 實作付款狀態同步任務在 src/payment/jobs/paymentStatusSync.ts
- [ ] T035 [US2] 加入團體版付款的管理權限驗證
- [ ] T036 [US2] 實作付款確認和服務開通邏輯

**檢查點**: 此時使用者故事1和2都應該獨立運作

---

## 第5階段：使用者故事3 - 付款安全與訂單管理 (優先級: P2)

**目標**: 系統提供完整的付款安全防護和訂單管理功能，包含交易記錄、退款處理、重複付款防護

**獨立測試**: 各種付款異常情況和管理操作的處理能力

### 使用者故事3實作

- [ ] T037 [P] [US3] 建立 RefundRecord 模型在 src/payment/models/RefundRecord.ts
- [ ] T038 [P] [US3] 建立 FinancialStats 模型在 src/payment/models/FinancialStats.ts
- [ ] T039 [P] [US3] 建立 PaymentLog 模型在 src/payment/models/PaymentLog.ts
- [ ] T040 [P] [US3] 實作退款驗證器在 src/payment/validators/refundValidators.ts
- [ ] T041 [US3] 實作 RefundService 在 src/payment/services/RefundService.ts（依賴 T037）
- [ ] T042 [US3] 實作 ReportService 在 src/payment/services/ReportService.ts（依賴 T038）
- [ ] T043 [US3] 實作退款控制器在 src/payment/controllers/RefundController.ts
- [ ] T044 [US3] 實作報表控制器在 src/payment/controllers/ReportController.ts
- [ ] T045 [US3] 實作 Webhook 驗證中介軟體在 src/payment/middleware/webhookVerificationMiddleware.ts
- [ ] T046 [US3] 實作退款處理任務在 src/payment/jobs/refundProcessing.ts
- [ ] T047 [US3] 實作財務報告任務在 src/payment/jobs/financialReporting.ts
- [ ] T048 [US3] 加入完整的付款安全審計和異常偵測

**檢查點**: 所有使用者故事現在都應該獨立功能正常

---

## 第6階段：完善與橫切關注點

**目的**: 影響多個使用者故事的改進

- [ ] T049 [P] 實作多幣別支援和匯率處理
- [ ] T050 [P] 實作付款限額控制和風險管理
- [ ] T051 [P] 實作付款統計分析和儀表板
- [ ] T052 [P] 實作自動對帳和財務核銷功能
- [ ] T053 [P] 實作付款爭議處理工作流程
- [ ] T054 程式碼清理和重構優化
- [ ] T055 [P] 效能優化和大量交易測試
- [ ] T056 [P] 安全強化和PCI合規檢查
- [ ] T057 [P] API 文件更新和Stripe整合測試

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
- **使用者故事3（P2）**: 基礎建設後可開始 - 依賴US1的付款系統但可獨立測試

### 每個使用者故事內部

- 模型在服務之前
- 驗證器在服務之前
- 服務在控制器之前
- 核心實作在任務處理之前
- 故事完成後才移到下一優先順序

### 平行執行機會

- 所有標記[P]的設置任務可平行執行
- 所有標記[P]的基礎建設任務可平行執行（在第2階段內）
- 基礎建設階段完成後，US1和US2可平行開始（都是P1優先級）
- 故事內標記[P]的模型和驗證器可平行執行
- 不同使用者故事可由不同團隊成員平行工作

---

## 平行執行範例：使用者故事1

```bash
# 同時啟動使用者故事1的所有模型和驗證器：
任務: "建立 OrderRecord 模型在 src/payment/models/OrderRecord.ts"
任務: "建立 PaymentTransaction 模型在 src/payment/models/PaymentTransaction.ts"
任務: "建立 ProductConfig 模型在 src/payment/models/ProductConfig.ts"
任務: "實作付款驗證器在 src/payment/validators/paymentValidators.ts"
```

---

## 實作策略

### MVP優先（使用者故事1和2）

1. 完成第1階段：設置
2. 完成第2階段：基礎建設（關鍵 - 阻塞所有故事）
3. 完成第3和4階段：使用者故事1和2（都是P1優先級）
4. **停止並驗證**: 獨立測試基本付款功能
5. 如果準備好就部署/展示

### 漸進式交付

1. 完成設置 + 基礎建設 → 基礎就緒
2. 加入使用者故事1 → 獨立測試 → 部署/展示（個人版MVP）
3. 加入使用者故事2 → 獨立測試 → 部署/展示（團體版）
4. 加入使用者故事3 → 獨立測試 → 部署/展示（完整版）
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

## 安全注意事項

- **PCI合規**: 所有敏感付款資料必須通過Stripe處理，不可在本地系統儲存
- **API金鑰安全**: Stripe API金鑰必須安全存儲，區分測試和生產環境
- **Webhook驗證**: 所有Stripe Webhook必須驗證簽名確保來源真實性
- **付款冪等性**: 所有付款操作必須支援冪等性，防止重複扣款
- **錯誤處理**: 付款錯誤必須提供清晰的使用者指引，避免洩露系統資訊

---

## 注意事項

- [P] 任務 = 不同檔案，無依賴性
- [Story] 標籤將任務對應到特定使用者故事以便追溯
- 每個使用者故事應該能夠獨立完成和測試
- Stripe整合需要處理各種付款狀態和webhook事件
- 財務資料準確性是絕對要求，必須實現完整的審計追蹤
- 每個任務或邏輯群組後提交
- 在任何檢查點停止以獨立驗證故事
- 避免：模糊任務、相同檔案衝突、破壞獨立性的跨故事依賴