<!--
Sync Impact Report - Constitution Update
═══════════════════════════════════════════════════════════════════════════════
Version Change: 2.0.0 → 2.1.0
Rationale: MINOR version bump - Critical language requirements clarification for Japanese end-users,
           added multi-language development standards while preserving Traditional Chinese for 
           internal development documentation

Modified Principles:
  - V. Documentation & Communication Standards → Multi-language Development & User Interface Standards
    (CRITICAL CHANGE: End-user interfaces MUST use Japanese, internal docs remain Traditional Chinese)

Added Sections:
  - Medical terminology cross-reference requirements (Chinese-Japanese)
  - User interface localization standards
  - Quality assurance for Japanese language content

Removed Sections:
  - Outdated assumption that end-users would use Traditional Chinese

Templates Requiring Updates:
  ✅ plan-template.md - Compatible, internal development documents remain zh-TW
  ✅ spec-template.md - Compatible, specs remain zh-TW with Japanese terminology notes
  ✅ tasks-template.md - Compatible, tasks remain zh-TW for development team
  ✅ checklist-template.md - Compatible, development checklists remain zh-TW
  ✅ agent-file-template.md - Compatible, development guidelines remain zh-TW
  ⚠ All command files in .github/prompts/ - MUST clarify Japanese UI vs Chinese dev docs
  ⚠ Frontend implementation - MUST implement Japanese localization for all user-facing content
  ⚠ Backend error messages - MUST return Japanese messages to frontend/users
  ⚠ Email templates - MUST be in Japanese for end users (OTP, notifications, etc.)

Follow-up TODOs:
  - Update command prompt files to distinguish between dev docs (zh-TW) and UI content (Japanese)
  - Create medical terminology Chinese-Japanese cross-reference table
  - Establish Japanese language review process with client
  - Implement Japanese localization system for all user-facing content
  - Add Japanese language quality checks to CI/CD pipeline
  - Update error handling to return Japanese messages to users

Generated: 2025-11-03
Previous Update: 2025-11-03 (v2.0.0 - Initial medical system constitution)
Original Ratification: 2025-10-30 (v1.0.0 - Initial constitution)
═══════════════════════════════════════════════════════════════════════════════
-->

# D・リレーションズ 目合わせ・力量テスト支援サイト 開發憲章

## 核心原則 (Core Principles)

### I. 醫學資料完整性 (Medical Data Integrity) - 不可協商

所有醫學測驗相關的資料處理必須確保絕對的完整性與準確性：

- **題目資料不可變性**: 測驗題目一旦建立並審核，不得任意修改。所有題目修改必須經過版本控制與稽核記錄。
- **答案資料防竄改**: 使用者答案一旦提交，不得修改。系統必須記錄每次答案提交的時間戳記與雜湊值。
- **圖片完整性驗證**: 所有細胞圖片必須具備校驗碼（checksum），確保圖片未被竄改或損毀。
- **測驗結果不可逆**: 測驗結果一旦產生，不得人工修改。若發現錯誤，必須透過版本化的更正程序處理。
- **隨機性可重現**: 隨機出題邏輯必須可重現，以供稽核與爭議處理使用。
- **資料備份與復原**: 所有醫學測驗資料必須進行定期備份，並具備災難復原機制。
- **操作記錄追蹤**: 所有對測驗資料的操作（建立、讀取、更新、刪除）必須記錄操作者、時間與內容。

**理由**: 醫學測驗結果直接影響專業認證與病患安全。資料完整性是醫療系統的基本要求，任何資料竄改可能導致錯誤的能力評估。

### II. 安全性與隱私合規 (Security & Privacy Compliance) - 不可協商

系統必須確保使用者隱私與資料安全，符合醫療資料處理法規：

- **OTP 驗證強制性**: 所有付費測驗與團體測驗必須通過一次性密碼驗證，確保身份真實性。
- **個人資料加密**: 所有個人識別資訊（姓名、電子郵件、測驗結果）必須加密儲存與傳輸。
- **存取權限最小化**: 系統操作者僅能存取執行職務所需的最小資料範圍。
- **測驗結果隱私**: 個人測驗結果僅限本人查看。團體測驗結果僅限授權的管理者查看。
- **資料保存期限**: 個人資料與測驗結果必須依據法規要求設定保存期限與自動刪除機制。
- **第三方整合安全**: 與 Stripe 等第三方服務的整合必須使用安全的 API 金鑰管理與 HTTPS 加密。
- **安全事件記錄**: 所有安全相關事件（登入失敗、權限違規、資料存取）必須記錄並監控。
- **定期安全稽核**: 系統必須定期進行安全性評估與漏洞掃描。

**理由**: 醫療資料涉及個人隱私與法規合規。任何資料外洩或安全漏洞可能導致法律責任與信任危機。

### III. 使用者體驗與可及性 (User Experience & Accessibility) - 不可協商

系統必須提供所有使用者都能順利操作的介面：

- **醫療專業友善**: 介面設計必須符合醫療專業人員的操作習慣與認知模式。
- **無障礙設計**: 必須符合 WCAG 2.1 Level AA 標準，支援螢幕閱讀器與鍵盤導航。
- **多裝置相容**: 支援桌面、平板與行動裝置，確保測驗體驗一致。
- **直覺式導航**: 測驗流程必須清晰明確，避免使用者迷失或誤操作。
- **錯誤處理友善**: 錯誤訊息必須清楚說明問題與解決方法，避免技術術語。
- **載入時間優化**: 圖片載入與頁面轉換必須快速，避免影響測驗專注度。
- **視覺疲勞考量**: 長時間測驗的介面必須考慮視覺疲勞，提供適當的休息提示。
- **操作確認機制**: 重要操作（提交答案、結束測驗）必須提供確認步驟。

**理由**: 良好的使用者體驗確保測驗結果的準確性。複雜或令人困惑的介面可能影響受測者表現，導致測驗結果失真。

### IV. 系統效能與可靠性 (System Performance & Reliability) - 不可協商

醫療級系統必須確保高可用性與穩定效能：

- **服務可用性**: 系統可用性必須達到 99.9% 以上，計劃性維護除外。
- **回應時間標準**:
  - 頁面載入: 初次載入 <3 秒，後續載入 <1 秒
  - API 回應: p95 <300ms, p99 <1 秒
  - 圖片載入: <2 秒（含醫學圖片）
- **並發使用者支援**: 必須支援 1000 名並發使用者同時進行測驗。
- **資料庫效能**: 查詢回應時間 <200ms，複雜報表生成 <5 秒。
- **自動擴展**: 系統必須能在高負載時自動擴展資源。
- **故障恢復**: 系統故障後必須在 15 分鐘內恢復服務。
- **測驗進度保護**: 測驗過程中的暫時性中斷不得影響已完成的進度。
- **效能監控**: 所有關鍵效能指標必須即時監控與告警。

**理由**: 醫學測驗通常有時間限制，系統效能問題可能影響測驗公平性。高可用性確保測驗能夠按計劃進行。

### V. 多語言開發與用戶介面標準 (Multi-language Development & User Interface Standards) - 不可協商

開發文件與用戶介面必須分別使用適當的語言，確保開發效率與用戶體驗：

#### 開發團隊內部文件（繁體中文）
- **功能規格書 (spec.md)**: 所有功能規格、使用者故事、驗收條件與需求必須使用繁體中文撰寫，專有名詞需標註日文原文。
- **實作計畫 (plan.md)**: 所有技術背景、架構決策與實作計畫必須使用繁體中文撰寫。
- **任務描述 (tasks.md)**: 所有任務清單、描述與驗收條件必須使用繁體中文撰寫。
- **開發者文件**: 內部技術文件、API 說明、部署指南等開發相關文件使用繁體中文。

#### 用戶介面與面向最終用戶內容（日文）
- **介面文字**: 所有顯示在介面上的文字內容必須使用日文，嚴格遵照客戶指定的日文內容。
- **錯誤訊息**: 所有用戶面向的錯誤訊息、警告與通知必須使用日文。
- **系統通知**: 包含 OTP 驗證郵件、測驗結果通知等所有系統發送的訊息必須使用日文。
- **用戶指南**: 最終用戶操作手冊、說明頁面等必須使用日文。
- **測驗內容**: 測驗介面、說明文字、結果報告等必須使用日文。

#### 醫學術語與專有名詞處理
- **規格書標註**: 醫學相關專有名詞在規格書中必須同時標示繁體中文與日文原文（例：細胞分類 / 細胞分類）。
- **術語對照表**: 維護醫學術語的中日對照表，確保翻譯一致性。
- **客戶確認**: 所有醫學術語的日文使用必須經過客戶確認，避免專業用詞錯誤。

#### 程式碼與技術文件例外規則
- **原始碼**: 變數名稱、函式名稱、類別名稱使用英文以確保技術清晰度。
- **內部技術註解**: 解釋實作細節的程式碼註解可使用英文或繁體中文。
- **第三方整合**: 第三方函式庫文件引用保留原始語言。
- **版本控制**: Git commit 訊息使用英文以利國際協作。

#### 品質保證要求
- **雙重檢查**: 所有日文介面文字必須經過母語人士或客戶確認。
- **一致性檢查**: 定期檢查術語使用的一致性，避免同一概念出現不同日文表達。
- **本地化測試**: 介面文字必須在實際環境中測試，確保顯示正確且符合日文使用習慣。

**理由**: 台灣開發團隊使用繁體中文進行內部溝通可提高開發效率與準確性。日本最終用戶與客戶使用日文介面確保系統的可用性與專業性。明確的語言分工避免混淆並維持專業標準。

### VI. OTP 與電子郵件安全要求 (OTP & Email Security Requirements) - 不可協商

一次性密碼系統必須確保身份驗證的安全性與可靠性：

- **OTP 產生安全性**: 一次性密碼必須使用密碼學安全的隨機數產生器，長度至少 6 位數字。
- **有效期限控制**: OTP 有效期限不得超過 10 分鐘，過期後必須重新產生。
- **重試限制**: 同一電子郵件地址的 OTP 驗證失敗超過 5 次後，必須實施暫時鎖定（30 分鐘）。
- **發送頻率限制**: 同一電子郵件地址的 OTP 發送頻率限制為每分鐘最多 1 次。
- **電子郵件傳輸安全**: 所有 OTP 電子郵件必須使用 TLS 加密傳輸。
- **郵件內容安全**: OTP 郵件不得包含完整的測驗連結，僅提供驗證碼。
- **會話管理**: OTP 驗證成功後的會話必須設定適當的過期時間與安全 Cookie。
- **裝置綁定**: 團體測驗的管理者 OTP 驗證必須考慮裝置與瀏覽器的變更。

**理由**: OTP 是防止測驗作弊與身份冒用的關鍵機制。安全的 OTP 系統確保測驗結果的可信度。

### VII. 付款安全與合規 (Payment Security & Compliance) - 不可協商

Stripe 付款整合必須確保金融交易的安全性與合規性：

- **PCI 合規**: 必須遵循 PCI DSS 標準，不得在本地系統儲存信用卡資料。
- **Stripe 整合安全**: 使用 Stripe 官方 SDK，確保 API 金鑰的安全管理。
- **交易記錄**: 所有付款交易必須記錄完整的稽核軌跡，包含時間、金額、狀態與測驗資訊。
- **退款機制**: 必須提供退款機制與相應的業務流程。
- **重複扣款防護**: 防止使用者意外重複購買或重複扣款。
- **交易狀態同步**: 系統必須與 Stripe 交易狀態保持同步，處理各種付款狀態。
- **詐欺偵測**: 整合 Stripe 的詐欺偵測機制，監控異常交易。
- **合規報告**: 生成符合法規要求的財務與交易報告。

**理由**: 付款系統的安全性直接影響使用者信任與法規合規。任何付款漏洞可能導致財務損失與法律責任。

### VIII. 測驗評估完整性 (Testing Assessment Integrity) - 不可協商

確保測驗過程的公平性與結果的可信度：

- **防作弊機制**: 實施技術手段防止測驗過程中的作弊行為（如截圖、複製、外部輔助）。
- **時間限制強制**: 測驗時間限制必須嚴格執行，不允許延長或暫停。
- **瀏覽器安全**: 測驗過程中限制瀏覽器的某些功能（如右鍵、開發者工具）。
- **題目隨機性**: 確保每次測驗的題目與圖片組合都是隨機的，但同一團體測驗的隨機性必須一致。
- **答案提交確認**: 每個答案的提交必須有明確的確認機制，防止誤操作。
- **測驗環境監控**: 記錄測驗過程中的異常行為（如長時間無操作、頻繁切換視窗）。
- **結果計算透明**: 測驗結果的計算邏輯必須透明且可稽核。
- **爭議處理機制**: 提供測驗結果爭議的申訴與處理機制。

**理由**: 測驗完整性是醫學能力評估的基礎。任何作弊或不公平情況都會影響評估結果的可信度與公平性。

## 效能標準 (Performance Standards)

### 測量與監控 (Measurement & Monitoring)

- **真實使用者監控 (RUM)**: 追蹤實際使用者體驗指標（頁面載入時間、互動延遲、錯誤率）。
- **合成監控**: 每 5 分鐘自動檢查，在使用者發現問題前進行偵測。
- **效能預算**: 每個功能提案必須包含預估的效能影響。預算超支需要在合併前進行優化。
- **基準指標**: 每次發布前建立基準效能指標。發布後監控與基準比較。

### 優化指導原則 (Optimization Guidelines)

- **避免過早優化**: 在沒有證據前避免優化。先進行效能分析，只優化熱點路徑。
- **何時優化**: 當指標顯示使用者影響或接近限制時進行優化（>300ms API 回應、>3 秒頁面載入、>70% 資源使用）。
- **優化流程**: (1) 測量 → (2) 識別瓶頸 → (3) 優化 → (4) 再次測量 → (5) 記錄影響。

## 品質保證流程 (Quality Assurance Process)

### 合併前自動檢核 (Pre-Merge Automated Gates)

- 所有單元測試通過（必要）
- 所有整合測試通過（必要）
- 程式碼覆蓋率 ≥80%（必要）
- 程式碼檢查零錯誤（必要）
- 型別檢查通過（必要）
- 安全掃描無高危險或嚴重漏洞（必要）
- OTP 安全性測試通過（必要）
- 付款流程安全測試通過（必要）

### 合併前人工檢核 (Pre-Merge Manual Gates)

- 合格審查者的程式碼審查批准（必要）
- UI 變更的設計審查（面向使用者變更時必要）
- 高流量端點的效能審查（API 變更時必要）
- 互動元素的可及性審查（UI 變更時必要）
- 醫學資料處理的合規審查（資料變更時必要）

### 完成定義 (Definition of Done)

功能完成的標準：

1. 所有測試撰寫完成並通過
2. 程式碼審查完成並核准
3. 文件更新完成（API 文件、使用者指南等）
4. 效能驗證符合要求
5. 可及性驗證完成（自動化 + 人工測試）
6. 安全性驗證完成（OTP、付款、資料保護）
7. 監控/記錄設定完成
8. 部署至測試環境並驗證
9. 產品負責人簽核

## 治理 (Governance)

本憲章優先於所有其他開發實務與政策。所有團隊成員必須理解並遵循這些原則。

### 修訂程序 (Amendment Process)

- **提案**: 任何團隊成員都可以提出修訂案並提供理由。
- **審查期間**: 最少 5 個工作日供團隊審查與討論。
- **核准**: 需要至少 75% 活躍團隊成員的共識。
- **遷移計畫**: 破壞性變更需要文件化的遷移路徑與時間表。
- **版本更新**: 遵循語意化版本（MAJOR.MINOR.PATCH）。

### 合規與執行 (Compliance & Enforcement)

- 所有程式碼審查必須驗證憲章合規性。
- CI/CD 流水線強制執行自動檢核。
- 每季憲章審查會議評估有效性。
- 違規行為需要立即修正或文件化例外（含到期日）。

### 例外處理 (Exception Handling)

- 例外情況需要書面理由與時限核准。
- 記錄原因、影響、補救計畫與到期日。
- 例外追蹤在 `.specify/memory/exceptions.md`（如需要則建立）。
- 過期例外視為違規處理。

### 活文件 (Living Document)

- 本憲章每季審查並視需要修訂。
- 修訂反映經驗學習與專案需求演進。
- 所有團隊成員貢獻保持原則實用且相關。

**版本**: 2.1.0 | **批准日期**: 2025-10-30 | **最後修訂**: 2025-11-03
