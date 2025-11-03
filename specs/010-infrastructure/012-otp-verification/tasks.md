# 任務清單：OTP 驗證機制

**輸入**: 設計文件來自 `/specs/010-infrastructure/012-otp-verification/`
**前置條件**: plan.md (必要), spec.md (必要，用於使用者故事), research.md, data-model.md, contracts/

**組織方式**: 任務按使用者故事分組，以實現每個故事的獨立實作和測試。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可平行執行（不同檔案，無依賴性）
- **[Story]**: 此任務屬於哪個使用者故事（例如 US1, US2, US3）
- 描述中包含確切的檔案路徑

## 路徑慣例

基於計畫文件，使用單一專案結構：`src/otp/`, `tests/otp/` 位於儲存庫根目錄

## 第1階段：設置（共享基礎架構）

**目的**: 專案初始化和基本結構

- [ ] T001 根據實作計畫建立 OTP 模組專案結構
- [ ] T002 初始化 Node.js + TypeScript OTP 服務依賴項
- [ ] T003 [P] 配置 nodemailer、Redis 和 crypto 相關套件
- [ ] T004 [P] 設置 Jest 測試框架和 OTP 測試配置
- [ ] T005 [P] 配置郵件Mock服務（MailHog）用於測試

---

## 第2階段：基礎建設（阻塞前置條件）

**目的**: 所有使用者故事實作前必須完成的核心基礎架構

**⚠️ 關鍵**: 在此階段完成前，無法開始任何使用者故事工作

- [ ] T006 設置 Redis 連線配置用於 OTP 暫存
- [ ] T007 設置 PostgreSQL 連線用於日誌記錄
- [ ] T008 [P] 建立 OTP 相關的 TypeScript 型別定義在 src/otp/types/
- [ ] T009 [P] 實作基礎加密工具在 src/otp/utils/cryptoUtils.ts
- [ ] T010 [P] 實作時間處理工具在 src/otp/utils/timeUtils.ts
- [ ] T011 [P] 實作輸入驗證工具在 src/otp/utils/validationUtils.ts
- [ ] T012 建立郵件服務提供者基礎架構在 src/otp/providers/
- [ ] T013 建立 OTP 錯誤處理和日誌記錄基礎架構

**檢查點**: 基礎建設就緒 - 使用者故事實作現在可以平行開始

---

## 第3階段：使用者故事1 - 快速OTP認證流程 (優先級: P1) 🎯 MVP

**目標**: 付費用戶點擊郵件連結後，能夠快速收到OTP認證碼並完成驗證，無縫進入付費功能

**獨立測試**: 觸發OTP發送、接收郵件、輸入驗證碼的完整流程能正常運作

### 使用者故事1實作

- [ ] T014 [P] [US1] 建立 OTPRecord 模型在 src/otp/models/OTPRecord.ts
- [ ] T015 [P] [US1] 建立 OTPConfig 模型在 src/otp/models/OTPConfig.ts
- [ ] T016 [P] [US1] 建立郵件模板在 src/otp/templates/otpEmailTemplate.html
- [ ] T017 [US1] 實作 OTPGeneratorService 在 src/otp/services/OTPGeneratorService.ts（依賴 T014, T015）
- [ ] T018 [US1] 實作 EmailDeliveryService 在 src/otp/services/EmailDeliveryService.ts
- [ ] T019 [US1] 實作 OTPVerificationService 在 src/otp/services/OTPVerificationService.ts
- [ ] T020 [US1] 實作 OTP 控制器在 src/otp/controllers/OTPController.ts
- [ ] T021 [US1] 實作基礎郵件提供者在 src/otp/providers/SMTPProvider.ts
- [ ] T022 [US1] 實作模板渲染器在 src/otp/templates/templateRenderer.ts
- [ ] T023 [US1] 加入 OTP 生成和驗證的基本日誌記錄

**檢查點**: 此時使用者故事1應該完全功能正常且可獨立測試

---

## 第4階段：使用者故事2 - 智能重發與錯誤處理 (優先級: P1)

**目標**: 當用戶未收到OTP或輸入錯誤時，能夠輕鬆重新獲取認證碼並獲得清晰的錯誤指引

**獨立測試**: 模擬各種錯誤情況（輸入錯誤、過期、重發請求）的處理能力

### 使用者故事2實作

- [ ] T024 [P] [US2] 建立 RateLimitRecord 模型在 src/otp/models/RateLimitRecord.ts
- [ ] T025 [P] [US2] 建立 OTP 驗證控制器在 src/otp/controllers/OTPVerificationController.ts
- [ ] T026 [P] [US2] 實作 OTP 錯誤處理中介軟體在 src/otp/middleware/errorHandling.ts
- [ ] T027 [US2] 實作 RateLimitService 在 src/otp/services/RateLimitService.ts（依賴 T024）
- [ ] T028 [US2] 實作速率限制中介軟體在 src/otp/middleware/otpRateLimit.ts
- [ ] T029 [US2] 擴展 OTPVerificationService 支援重發和錯誤處理
- [ ] T030 [US2] 實作 OTP 過期處理和清理機制
- [ ] T031 [US2] 加入友善的錯誤訊息和使用者指引
- [ ] T032 [US2] 實作 OTP 狀態查詢功能

**檢查點**: 此時使用者故事1和2都應該獨立運作

---

## 第5階段：使用者故事3 - 安全防護與審計 (優先級: P2)

**目標**: 系統能夠偵測和防範OTP相關的安全威脅，包含暴力破解、重放攻擊、異常使用模式

**獨立測試**: 模擬各種攻擊場景來驗證安全防護機制的有效性

### 使用者故事3實作

- [ ] T033 [P] [US3] 建立 SecurityEvent 模型在 src/otp/models/SecurityEvent.ts
- [ ] T034 [P] [US3] 建立 VerificationStats 模型在 src/otp/models/VerificationStats.ts
- [ ] T035 [P] [US3] 實作安全檢查中介軟體在 src/otp/middleware/securityCheck.ts
- [ ] T036 [US3] 實作 SecurityMonitorService 在 src/otp/services/SecurityMonitorService.ts
- [ ] T037 [US3] 實作暴力破解防護機制
- [ ] T038 [US3] 實作重放攻擊偵測和防護
- [ ] T039 [US3] 實作異常使用模式偵測
- [ ] T040 [US3] 實作安全事件告警系統
- [ ] T041 [US3] 加入完整的安全審計日誌
- [ ] T042 [US3] 實作 OTP 加密存儲機制

**檢查點**: 所有使用者故事現在都應該獨立功能正常

---

## 第6階段：完善與橫切關注點

**目的**: 影響多個使用者故事的改進

- [ ] T043 [P] 實作多重郵件服務商支援在 src/otp/providers/
- [ ] T044 [P] 加入 SendGrid 提供者在 src/otp/providers/SendGridProvider.ts
- [ ] T045 [P] 實作郵件發送統計和監控
- [ ] T046 [P] 實作 OTP 清理排程任務
- [ ] T047 [P] 加入郵件送達狀態追蹤
- [ ] T048 程式碼清理和重構優化
- [ ] T049 [P] 效能優化和負載測試準備
- [ ] T050 [P] 安全強化和滲透測試
- [ ] T051 [P] API 文件更新和整合測試

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
- **使用者故事3（P2）**: 基礎建設後可開始 - 可能與US1/US2整合但應可獨立測試

### 每個使用者故事內部

- 模型在服務之前
- 服務在控制器之前
- 核心實作在中介軟體之前
- 故事完成後才移到下一優先順序

### 平行執行機會

- 所有標記[P]的設置任務可平行執行
- 所有標記[P]的基礎建設任務可平行執行（在第2階段內）
- 基礎建設階段完成後，US1和US2可平行開始（都是P1優先級）
- 故事內標記[P]的模型和範本可平行執行
- 不同使用者故事可由不同團隊成員平行工作

---

## 平行執行範例：使用者故事1

```bash
# 同時啟動使用者故事1的所有模型和範本：
任務: "建立 OTPRecord 模型在 src/otp/models/OTPRecord.ts"
任務: "建立 OTPConfig 模型在 src/otp/models/OTPConfig.ts"
任務: "建立郵件模板在 src/otp/templates/otpEmailTemplate.html"
```

---

## 實作策略

### MVP優先（使用者故事1和2）

1. 完成第1階段：設置
2. 完成第2階段：基礎建設（關鍵 - 阻塞所有故事）
3. 完成第3和4階段：使用者故事1和2（都是P1優先級）
4. **停止並驗證**: 獨立測試基本OTP功能
5. 如果準備好就部署/展示

### 漸進式交付

1. 完成設置 + 基礎建設 → 基礎就緒
2. 加入使用者故事1 → 獨立測試 → 部署/展示（基本MVP）
3. 加入使用者故事2 → 獨立測試 → 部署/展示（強化版）
4. 加入使用者故事3 → 獨立測試 → 部署/展示（安全版）
5. 每個故事都在不破壞先前故事的情況下增加價值

### 平行團隊策略

有多個開發者時：

1. 團隊一起完成設置 + 基礎建設
2. 基礎建設完成後：
   - 開發者A：使用者故事1
   - 開發者B：使用者故事2
   - 開發者C：使用者故事3（US1,US2完成後）
3. 故事獨立完成和整合

---

## 注意事項

- [P] 任務 = 不同檔案，無依賴性
- [Story] 標籤將任務對應到特定使用者故事以便追溯
- 每個使用者故事應該能夠獨立完成和測試
- OTP 安全性是關鍵，確保加密存儲和傳輸
- 郵件發送需要處理各種服務商的API限制
- 每個任務或邏輯群組後提交
- 在任何檢查點停止以獨立驗證故事
- 避免：模糊任務、相同檔案衝突、破壞獨立性的跨故事依賴