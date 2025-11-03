# 任務清單：身份認證與授權系統

**輸入**: 設計文件來自 `/specs/010-infrastructure/011-auth-system/`
**前置條件**: plan.md (必要), spec.md (必要，用於使用者故事), research.md, data-model.md, contracts/

**組織方式**: 任務按使用者故事分組，以實現每個故事的獨立實作和測試。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可平行執行（不同檔案，無依賴性）
- **[Story]**: 此任務屬於哪個使用者故事（例如 US1, US2, US3）
- 描述中包含確切的檔案路徑

## 路徑慣例

基於計畫文件，使用單一專案結構：`src/auth/`, `tests/auth/` 位於儲存庫根目錄

## 第1階段：設置（共享基礎架構）

**目的**: 專案初始化和基本結構

- [ ] T001 根據實作計畫建立專案結構
- [ ] T002 初始化 Node.js + TypeScript 專案與 Express.js 依賴項
- [ ] T003 [P] 配置 ESLint、Prettier 和 TypeScript 編譯設定
- [ ] T004 [P] 設置 Jest 測試框架和測試腳本
- [ ] T005 [P] 配置環境變數管理（dotenv）和設定檔案

---

## 第2階段：基礎建設（阻塞前置條件）

**目的**: 所有使用者故事實作前必須完成的核心基礎架構

**⚠️ 關鍵**: 在此階段完成前，無法開始任何使用者故事工作

- [ ] T006 設置 PostgreSQL 資料庫連線和 Prisma ORM 配置
- [ ] T007 設置 Redis 連線配置用於 Session 快取
- [ ] T008 [P] 實作基礎中介軟體結構在 src/auth/middleware/
- [ ] T009 [P] 建立認證相關的 TypeScript 型別定義在 src/auth/types/
- [ ] T010 [P] 實作加密工具函式在 src/auth/utils/securityUtils.ts
- [ ] T011 [P] 實作輸入驗證工具在 src/auth/utils/validationUtils.ts
- [ ] T012 建立基礎錯誤處理和日誌記錄基礎架構

**檢查點**: 基礎建設就緒 - 使用者故事實作現在可以平行開始

---

## 第3階段：使用者故事1 - 免費版使用者快速註冊 (優先級: P1) 🎯 MVP

**目標**: 醫療從業人員可以快速填寫基本資料並立即開始免費測驗，無需複雜的身份認證流程

**獨立測試**: 填寫註冊表單後能立即訪問測驗功能，無需額外認證步驟

### 使用者故事1實作

- [ ] T013 [P] [US1] 建立 User 模型在 src/auth/models/User.ts
- [ ] T014 [P] [US1] 建立 UserRole 模型在 src/auth/models/UserRole.ts
- [ ] T015 [P] [US1] 建立使用者註冊驗證規則在 src/auth/validators/registrationValidators.ts
- [ ] T016 [US1] 實作 UserService 在 src/auth/services/UserService.ts（依賴 T013, T014）
- [ ] T017 [US1] 實作使用者註冊 API 端點在 src/auth/controllers/UserController.ts
- [ ] T018 [US1] 實作基本權限檢查中介軟體在 src/auth/middleware/permissionMiddleware.ts
- [ ] T019 [US1] 加入註冊流程的錯誤處理和日誌記錄
- [ ] T020 [US1] 實作免費用戶訪問升級頁面的重導向邏輯

**檢查點**: 此時使用者故事1應該完全功能正常且可獨立測試

---

## 第4階段：使用者故事2 - 付費版OTP身份認證 (優先級: P1)

**目標**: 付費用戶透過郵件OTP認證確認身份，確保只有授權使用者能訪問付費測驗功能

**獨立測試**: 完整的OTP發送、驗證、Session建立流程能正常運作

### 使用者故事2實作

- [ ] T021 [P] [US2] 建立 OTPRecord 模型在 src/auth/models/OTPRecord.ts
- [ ] T022 [P] [US2] 建立 AuthSession 模型在 src/auth/models/AuthSession.ts
- [ ] T023 [P] [US2] 實作 OTP 生成工具在 src/auth/utils/otpUtils.ts
- [ ] T024 [US2] 實作 OTPService 在 src/auth/services/OTPService.ts（依賴 T021, T023）
- [ ] T025 [US2] 實作 SessionService 在 src/auth/services/SessionService.ts（依賴 T022）
- [ ] T026 [US2] 實作認證控制器在 src/auth/controllers/AuthController.ts
- [ ] T027 [US2] 實作 OTP 速率限制中介軟體在 src/auth/middleware/rateLimitMiddleware.ts
- [ ] T028 [US2] 實作 Session 驗證中介軟體在 src/auth/middleware/authMiddleware.ts
- [ ] T029 [US2] 加入 OTP 認證的安全日誌和錯誤處理

**檢查點**: 此時使用者故事1和2都應該獨立運作

---

## 第5階段：使用者故事3 - 團體版分層權限管理 (優先級: P2)

**目標**: 團體版購買者擁有管理權限，可配布測驗給受測者，而受測者僅能訪問指定測驗

**獨立測試**: 管理者購買、配布設定、受測者訪問的完整權限流程

### 使用者故事3實作

- [ ] T030 [P] [US3] 建立 AuthLog 模型在 src/auth/models/AuthLog.ts
- [ ] T031 [P] [US3] 建立 DeviceFingerprint 模型在 src/auth/models/DeviceFingerprint.ts
- [ ] T032 [P] [US3] 實作裝置指紋識別工具在 src/auth/utils/deviceUtils.ts
- [ ] T033 [US3] 實作 PermissionService 在 src/auth/services/PermissionService.ts
- [ ] T034 [US3] 擴展 SessionService 支援管理者1小時期限邏輯
- [ ] T035 [US3] 實作團體版權限控制在現有的 permissionMiddleware.ts
- [ ] T036 [US3] 實作 Session 控制器在 src/auth/controllers/SessionController.ts
- [ ] T037 [US3] 實作管理者和受測者的資料隔離邏輯
- [ ] T038 [US3] 加入跨裝置認證狀態檢查功能

**檢查點**: 所有使用者故事現在都應該獨立功能正常

---

## 第6階段：完善與橫切關注點

**目的**: 影響多個使用者故事的改進

- [ ] T039 [P] 實作認證統計和監控功能在 src/auth/services/StatsService.ts
- [ ] T040 [P] 實作 Session 自動清理排程任務
- [ ] T041 [P] 加入安全事件告警機制
- [ ] T042 [P] 實作緊急帳戶鎖定功能
- [ ] T043 程式碼清理和重構優化
- [ ] T044 [P] 效能優化跨所有認證流程
- [ ] T045 [P] 安全強化和滲透測試準備
- [ ] T046 [P] API 文件更新和 Swagger 整合

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
- **使用者故事2（P2）**: 基礎建設後可開始 - 可能與US1整合但應可獨立測試
- **使用者故事3（P3）**: 基礎建設後可開始 - 可能與US1/US2整合但應可獨立測試

### 每個使用者故事內部

- 模型在服務之前
- 服務在控制器之前
- 核心實作在整合之前
- 故事完成後才移到下一優先順序

### 平行執行機會

- 所有標記[P]的設置任務可平行執行
- 所有標記[P]的基礎建設任務可平行執行（在第2階段內）
- 基礎建設階段完成後，所有使用者故事可平行開始（如果團隊容量允許）
- 故事內標記[P]的模型可平行執行
- 不同使用者故事可由不同團隊成員平行工作

---

## 平行執行範例：使用者故事1

```bash
# 同時啟動使用者故事1的所有模型：
任務: "建立 User 模型在 src/auth/models/User.ts"
任務: "建立 UserRole 模型在 src/auth/models/UserRole.ts"
任務: "建立使用者註冊驗證規則在 src/auth/validators/registrationValidators.ts"
```

---

## 實作策略

### MVP優先（僅使用者故事1）

1. 完成第1階段：設置
2. 完成第2階段：基礎建設（關鍵 - 阻塞所有故事）
3. 完成第3階段：使用者故事1
4. **停止並驗證**: 獨立測試使用者故事1
5. 如果準備好就部署/展示

### 漸進式交付

1. 完成設置 + 基礎建設 → 基礎就緒
2. 加入使用者故事1 → 獨立測試 → 部署/展示（MVP！）
3. 加入使用者故事2 → 獨立測試 → 部署/展示
4. 加入使用者故事3 → 獨立測試 → 部署/展示
5. 每個故事都在不破壞先前故事的情況下增加價值

### 平行團隊策略

有多個開發者時：

1. 團隊一起完成設置 + 基礎建設
2. 基礎建設完成後：
   - 開發者A：使用者故事1
   - 開發者B：使用者故事2
   - 開發者C：使用者故事3
3. 故事獨立完成和整合

---

## 注意事項

- [P] 任務 = 不同檔案，無依賴性
- [Story] 標籤將任務對應到特定使用者故事以便追溯
- 每個使用者故事應該能夠獨立完成和測試
- 在實作前驗證失敗的測試
- 每個任務或邏輯群組後提交
- 在任何檢查點停止以獨立驗證故事
- 避免：模糊任務、相同檔案衝突、破壞獨立性的跨故事依賴