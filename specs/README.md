# D-Relations 規格文件架構

## 目錄結構說明

### 000-system/
系統整體規格文件，包含：
- `spec.md` - 系統主規格
- `D-Relations專案需求書.md` - 原始需求文件

### 010-infrastructure/ (基礎架構模組)
系統基礎設施和核心服務
- `011-auth-system/` - 身份認證與授權系統
- `012-otp-verification/` - OTP 驗證機制
- `013-session-management/` - Session 會話管理
- `014-email-service/` - 郵件服務系統
- `015-payment-integration/` - Stripe 付款整合

### 020-user-management/ (使用者管理模組)
使用者相關功能
- `021-user-registration/` - 使用者註冊功能
- `022-user-profile/` - 使用者資料管理
- `023-role-permissions/` - 角色權限管理

### 030-test-engine/ (測驗核心模組)
測驗系統核心功能
- `031-question-bank/` - 題庫管理系統
- `032-test-generator/` - 測驗生成引擎
- `033-test-execution/` - 測驗執行引擎
- `034-test-results/` - 測驗結果處理
- `035-progress-tracking/` - 測驗進度追蹤

### 040-test-variants/ (測驗版本模組)
不同版本的測驗功能
- `041-free-version/` - 免費版測驗功能
- `042-individual-paid/` - 個人付費版功能
- `043-group-distribution/` - 團體配布版功能

### 050-admin-features/ (管理功能模組)
管理者相關功能
- `051-group-management/` - 團體管理功能
- `052-admin-dashboard/` - 管理者儀表板
- `053-user-monitoring/` - 使用者監控功能

### 060-reporting-analytics/ (報告與分析模組)
結果報告和數據分析
- `061-basic-reporting/` - 基本結果報告
- `062-advanced-analytics/` - 進階統計分析
- `063-pdf-generation/` - PDF 報告生成

### 070-system-support/ (系統支援模組)
系統運維和支援功能
- `071-error-handling/` - 錯誤處理機制
- `072-logging-monitoring/` - 日誌與監控
- `073-data-protection/` - 資料保護功能
- `074-api-endpoints/` - API 端點管理

## 編號規則

- **第一層（模組級別）**: 以十位數編號（010, 020, 030...）
- **第二層（功能級別）**: 在模組編號基礎上加個位數（011, 012, 013...）
- 編號按照系統架構層次和依賴關係排列

## 文件命名規範

每個功能目錄包含：
- `spec.md` - 功能規格文件
- `checklists/` - 品質檢查清單（如需要）
- 其他相關文檔

## 依賴關係

1. **010-infrastructure** - 基礎設施，其他模組的依賴基礎
2. **020-user-management** - 使用者管理，依賴基礎設施
3. **030-test-engine** - 測驗核心，依賴使用者管理和基礎設施
4. **040-test-variants** - 測驗版本，依賴測驗核心
5. **050-admin-features** - 管理功能，依賴使用者管理和測驗核心
6. **060-reporting-analytics** - 報告分析，依賴測驗結果
7. **070-system-support** - 系統支援，為所有模組提供支援

---

**創建日期**: 2025年11月3日  
**版本**: 1.0  
**狀態**: 重新架構完成