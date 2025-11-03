# 任務清單：Session 會話管理

**輸入**: 設計文件來自 `/specs/010-infrastructure/013-session-management/`
**前置條件**: plan.md (必要), spec.md (必要，用於使用者故事), research.md, data-model.md, contracts/

**組織方式**: 任務按使用者故事分組，以實現每個故事的獨立實作和測試。

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可平行執行（不同檔案，無依賴性）
- **[Story]**: 此任務屬於哪個使用者故事（例如 US1, US2, US3）
- 描述中包含確切的檔案路徑

## 路徑慣例

基於計畫文件，使用單一專案結構：`src/session/`, `tests/session/` 位於儲存庫根目錄

## 第1階段：設置（共享基礎架構）

**目的**: 專案初始化和基本結構

- [ ] T001 根據實作計畫建立 Session 模組專案結構
- [ ] T002 初始化 Session 管理服務依賴項（Redis, connect-redis, express-session）
- [ ] T003 [P] 配置 uuid、時間處理和加密相關套件
- [ ] T004 [P] 設置 Jest 和 Redis Memory Server 測試環境
- [ ] T005 [P] 配置 Session 測試工具和 Mock 資料

---

## 第2階段：基礎建設（阻塞前置條件）

**目的**: 所有使用者故事實作前必須完成的核心基礎架構

**⚠️ 關鍵**: 在此階段完成前，無法開始任何使用者故事工作

- [ ] T006 設置 Redis Session 存儲配置和連線
- [ ] T007 設置 PostgreSQL 連線用於活動日誌記錄
- [ ] T008 [P] 建立 Session 相關的 TypeScript 型別定義在 src/session/types/
- [ ] T009 [P] 實作基礎 Session 工具在 src/session/utils/sessionUtils.ts
- [ ] T010 [P] 實作時間處理工具在 src/session/utils/timeUtils.ts
- [ ] T011 [P] 實作裝置識別工具在 src/session/utils/deviceUtils.ts
- [ ] T012 建立 Session 策略基礎架構在 src/session/strategies/
- [ ] T013 建立 Session 錯誤處理和日誌記錄基礎架構

**檢查點**: 基礎建設就緒 - 使用者故事實作現在可以平行開始

---

## 第3階段：使用者故事1 - 差異化Session期限管理 (優先級: P1) 🎯 MVP

**目標**: 系統根據用戶類型自動設定適當的Session期限，個人版和受測者享有10天便利期限，管理者有1小時安全期限

**獨立測試**: 創建不同類型用戶Session並驗證各自期限和行為

### 使用者故事1實作

- [ ] T014 [P] [US1] 建立 SessionRecord 模型在 src/session/models/SessionRecord.ts
- [ ] T015 [P] [US1] 建立 SessionConfig 模型在 src/session/models/SessionConfig.ts
- [ ] T016 [P] [US1] 建立個人版策略在 src/session/strategies/PersonalSessionStrategy.ts
- [ ] T017 [P] [US1] 建立管理者策略在 src/session/strategies/ManagerSessionStrategy.ts
- [ ] T018 [P] [US1] 建立受測者策略在 src/session/strategies/TesteeSessionStrategy.ts
- [ ] T019 [US1] 實作 SessionManager 在 src/session/services/SessionManager.ts（依賴 T014-T018）
- [ ] T020 [US1] 實作 SessionValidator 在 src/session/services/SessionValidator.ts
- [ ] T021 [US1] 實作 Session 控制器在 src/session/controllers/SessionController.ts
- [ ] T022 [US1] 實作 Session 中介軟體在 src/session/middleware/sessionMiddleware.ts
- [ ] T023 [US1] 加入 Session 期限管理的日誌記錄

**檢查點**: 此時使用者故事1應該完全功能正常且可獨立測試

---

## 第4階段：使用者故事2 - 跨裝置Session同步與隔離 (優先級: P1)

**目標**: 用戶在不同裝置或瀏覽器使用時，Session能夠適當同步或隔離，確保安全性的同時提供良好的多裝置使用體驗

**獨立測試**: 在不同裝置和瀏覽器中測試Session行為

### 使用者故事2實作

- [ ] T024 [P] [US2] 建立 DeviceFingerprint 模型在 src/session/models/DeviceFingerprint.ts
- [ ] T025 [P] [US2] 建立 ActivityRecord 模型在 src/session/models/ActivityRecord.ts
- [ ] T026 [P] [US2] 實作裝置檢查中介軟體在 src/session/middleware/deviceCheckMiddleware.ts
- [ ] T027 [US2] 實作 DeviceFingerprintService 在 src/session/services/DeviceFingerprintService.ts（依賴 T024）
- [ ] T028 [US2] 實作 ActivityTracker 在 src/session/services/ActivityTracker.ts（依賴 T025）
- [ ] T029 [US2] 擴展 SessionManager 支援跨裝置Session隔離
- [ ] T030 [US2] 實作活動追蹤中介軟體在 src/session/middleware/activityTrackingMiddleware.ts
- [ ] T031 [US2] 實作 Session 登出和清理功能
- [ ] T032 [US2] 加入跨裝置存取的安全日誌

**檢查點**: 此時使用者故事1和2都應該獨立運作

---

## 第5階段：使用者故事3 - 智能Session延期與安全控制 (優先級: P2)

**目標**: 系統能夠根據用戶活動智能調整Session期限，在確保安全的前提下優化使用體驗

**獨立測試**: 模擬各種使用模式和活動情況來驗證智能Session管理功能

### 使用者故事3實作

- [ ] T033 [P] [US3] 建立 SessionStats 模型在 src/session/models/SessionStats.ts
- [ ] T034 [P] [US3] 建立 SecurityEvent 模型在 src/session/models/SecurityEvent.ts
- [ ] T035 [P] [US3] 實作 Session 統計控制器在 src/session/controllers/SessionStatsController.ts
- [ ] T036 [US3] 實作智能延期邏輯在現有的 SessionManager 中
- [ ] T037 [US3] 實作異常 Session 偵測和安全控制
- [ ] T038 [US3] 實作管理者 Session 強制過期機制
- [ ] T039 [US3] 實作受測者測驗期間的智能延期
- [ ] T040 [US3] 實作 Session 安全監控和告警
- [ ] T041 [US3] 加入 Session 統計和分析功能
- [ ] T042 [US3] 實作 Session 備份和恢復機制

**檢查點**: 所有使用者故事現在都應該獨立功能正常

---

## 第6階段：完善與橫切關注點

**目的**: 影響多個使用者故事的改進

- [ ] T043 [P] 實作 Session 清理排程任務在 src/session/jobs/sessionCleanup.ts
- [ ] T044 [P] 實作統計聚合任務在 src/session/jobs/sessionStatsAggregation.ts
- [ ] T045 [P] 實作 Session 併發控制和限制
- [ ] T046 [P] 加入 Session 效能監控和指標
- [ ] T047 [P] 實作 Session 資料加密和安全強化
- [ ] T048 程式碼清理和重構優化
- [ ] T049 [P] 效能優化和容量規劃
- [ ] T050 [P] 安全強化和滲透測試準備
- [ ] T051 [P] API 文件更新和監控整合

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
- **使用者故事3（P2）**: 基礎建設後可開始 - 依賴US1的SessionManager但可獨立測試

### 每個使用者故事內部

- 模型在服務之前
- 策略在管理器之前
- 服務在控制器之前
- 核心實作在中介軟體之前
- 故事完成後才移到下一優先順序

### 平行執行機會

- 所有標記[P]的設置任務可平行執行
- 所有標記[P]的基礎建設任務可平行執行（在第2階段內）
- 基礎建設階段完成後，US1和US2可平行開始（都是P1優先級）
- 故事內標記[P]的模型和策略可平行執行
- 不同使用者故事可由不同團隊成員平行工作

---

## 平行執行範例：使用者故事1

```bash
# 同時啟動使用者故事1的所有模型和策略：
任務: "建立 SessionRecord 模型在 src/session/models/SessionRecord.ts"
任務: "建立 SessionConfig 模型在 src/session/models/SessionConfig.ts"
任務: "建立個人版策略在 src/session/strategies/PersonalSessionStrategy.ts"
任務: "建立管理者策略在 src/session/strategies/ManagerSessionStrategy.ts"
任務: "建立受測者策略在 src/session/strategies/TesteeSessionStrategy.ts"
```

---

## 實作策略

### MVP優先（使用者故事1和2）

1. 完成第1階段：設置
2. 完成第2階段：基礎建設（關鍵 - 阻塞所有故事）
3. 完成第3和4階段：使用者故事1和2（都是P1優先級）
4. **停止並驗證**: 獨立測試基本Session管理功能
5. 如果準備好就部署/展示

### 漸進式交付

1. 完成設置 + 基礎建設 → 基礎就緒
2. 加入使用者故事1 → 獨立測試 → 部署/展示（基本MVP）
3. 加入使用者故事2 → 獨立測試 → 部署/展示（多裝置版）
4. 加入使用者故事3 → 獨立測試 → 部署/展示（智能版）
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
- Session 安全性和期限精確度是關鍵
- Redis 設定需要考慮高可用性和持久化
- 每個任務或邏輯群組後提交
- 在任何檢查點停止以獨立驗證故事
- 避免：模糊任務、相同檔案衝突、破壞獨立性的跨故事依賴