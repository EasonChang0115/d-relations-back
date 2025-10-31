<!--
Sync Impact Report - Constitution Update
═══════════════════════════════════════════════════════════════════════════════
Version Change: 1.1.0 → 1.1.1
Rationale: PATCH version bump - Updated project name and clarified language requirements,
           ensured all placeholders replaced with concrete values

Modified Principles:
  - V. Documentation Language Standards - Enhanced clarity on scope and exceptions

Added Sections:
  - N/A

Removed Sections:
  - N/A

Templates Requiring Updates:
  ✅ plan-template.md - Validated, language-agnostic structure compatible
  ✅ spec-template.md - Validated, language-agnostic structure compatible
  ✅ tasks-template.md - Validated, language-agnostic structure compatible
  ✅ checklist-template.md - Validated, structure compatible
  ✅ agent-file-template.md - Validated, structure compatible
  ⚠ All command files in .github/prompts/ - MUST enforce zh-TW output for specs, plans, tasks
  ⚠ speckit.specify.prompt.md - MUST generate spec.md in Traditional Chinese
  ⚠ speckit.plan.prompt.md - MUST generate plan.md and design docs in Traditional Chinese
  ⚠ speckit.tasks.prompt.md - MUST generate tasks.md in Traditional Chinese

Follow-up TODOs:
  - Update command prompt files to explicitly enforce Traditional Chinese output
  - Add zh-TW language enforcement reminders in prompt file headers
  - Validate existing documentation against language requirements
  - Consider adding language validation checks to CI/CD pipeline

Generated: 2025-10-31
Previous Update: 2025-10-30 (v1.1.0 - Added documentation language standards)
Original Ratification: 2025-10-30 (v1.0.0 - Initial constitution)
═══════════════════════════════════════════════════════════════════════════════
-->

# D・リレーションズ力量測驗系統 開發憲章

## Core Principles

### I. Code Quality Standards (NON-NEGOTIABLE)

All code submitted to the repository MUST meet the following non-negotiable quality standards:

- **Readability First**: Code MUST be self-documenting with clear variable names, function names, and logical structure. Complex logic MUST include explanatory comments.
- **Single Responsibility**: Each function, class, or module MUST have one clearly defined purpose. Functions exceeding 50 lines MUST be justified or refactored.
- **No Dead Code**: Commented-out code, unused imports, and unreachable code are prohibited. Remove or document exceptional cases.
- **Type Safety**: Where applicable, use static typing (TypeScript, Python type hints, etc.). All public APIs MUST have type annotations.
- **Error Handling**: All error conditions MUST be handled explicitly. Silent failures are prohibited. Errors MUST include context for debugging.
- **Code Review Required**: No code merges to main without approval from at least one other developer who verifies compliance with these standards.

**Rationale**: Code is read far more often than written. Maintainability and onboarding speed are critical success factors. Poor code quality creates exponential technical debt.

### II. Testing Standards (NON-NEGOTIABLE)

Test-Driven Development is mandatory. All features MUST follow this sequence:

- **Test-First Development**: Write failing tests BEFORE implementation. This sequence is enforced: (1) Write test → (2) User/reviewer approves test → (3) Verify test fails → (4) Implement → (5) Verify test passes.
- **Coverage Requirements**: Minimum 80% code coverage for unit tests. Critical paths (authentication, payment, data modification) MUST have 100% coverage.
- **Test Categories Required**:
  - **Unit Tests**: Test individual functions/classes in isolation. MUST run in <1 second total.
  - **Integration Tests**: Test component interactions. Required for all API endpoints, database operations, and service integrations.
  - **Contract Tests**: Required for all external APIs, microservice boundaries, and shared data schemas.
- **Test Independence**: Each test MUST be runnable in isolation. No test dependencies or execution order requirements.
- **Test Clarity**: Test names MUST describe the scenario being tested in plain language (e.g., `test_user_login_fails_with_invalid_password`).
- **Continuous Testing**: All tests MUST pass before merge. CI/CD pipeline enforces this gate.

**Rationale**: Tests are living documentation and safety nets for refactoring. Test-first development ensures testability is built in, not bolted on. High-quality tests prevent regressions and enable confident iteration.

### III. User Experience Consistency

User-facing interfaces MUST provide a consistent, predictable experience:

- **Design System**: All UI components MUST follow the established design system. Custom styles require explicit justification and design review.
- **Accessibility**: MUST meet WCAG 2.1 Level AA standards. All interactive elements require keyboard navigation, screen reader support, and sufficient color contrast.
- **Response Time**: User actions MUST provide feedback within 100ms. Operations taking >1 second MUST show progress indicators.
- **Error Messages**: User-facing errors MUST be clear, actionable, and non-technical. Format: "What happened" + "Why" + "What to do next."
- **Progressive Enhancement**: Core functionality MUST work without JavaScript. Enhanced features can require JavaScript but MUST degrade gracefully.
- **Mobile-First**: All interfaces MUST be fully functional on mobile devices (touch targets ≥44px, responsive layouts, appropriate font sizes).
- **Consistent Patterns**: Use established patterns for common actions (navigation, forms, modals). Introducing new patterns requires UX review.

**Rationale**: Consistency reduces cognitive load and learning time. Accessible design is inclusive design and often improves usability for all users. Users should never feel confused or stuck.

### IV. Performance Requirements

System performance directly impacts user satisfaction and operational costs:

- **Response Time Targets**:
  - API endpoints: p95 <200ms, p99 <500ms
  - Page load (initial): <2 seconds on 3G network
  - Page load (subsequent): <500ms
- **Resource Limits**:
  - Backend memory: <512MB per service instance
  - Frontend bundle: <500KB initial load (gzipped), <100KB per route
  - Database queries: <100ms for simple queries, <500ms for complex aggregations
- **Scalability Requirements**:
  - MUST support 10x current user load without degradation
  - Database queries MUST use appropriate indexes
  - MUST implement caching for frequently accessed, rarely changing data
- **Monitoring Required**: All performance-critical paths MUST have metrics, logging, and alerting configured. Performance regressions >10% trigger investigation.
- **Performance Testing**: Load testing required for all endpoints expected to handle >100 requests/second or serve >1000 concurrent users.

**Rationale**: Performance is a feature, not an afterthought. Slow systems frustrate users and increase operational costs. Early performance testing prevents expensive rewrites.

### V. 文件語言標準 (不可協商)

所有面向規格說明、規劃與終端使用者的專案文件必須以繁體中文（zh-TW）撰寫：

- **功能規格書 (spec.md)**：所有功能規格、使用者故事、驗收條件與需求必須使用繁體中文撰寫。
- **實作計畫 (plan.md)**：所有技術背景、架構決策與實作計畫必須使用繁體中文撰寫。
- **使用者面向文件**：所有使用者指南、快速入門文件、API 文件與說明內容必須使用繁體中文撰寫。
- **任務描述 (tasks.md)**：所有任務清單、描述與驗收條件必須使用繁體中文撰寫。
- **使用者面向程式碼註解**：供終端使用者閱讀或用於文件產生的註解必須使用繁體中文。
- **錯誤訊息**：所有使用者面向的錯誤訊息、警告與通知必須使用繁體中文。
- **程式碼例外規則**：
  - 原始碼（變數名稱、函式名稱、類別名稱）可使用英文以確保技術清晰度與國際協作。
  - 解釋實作細節的內部技術註解可使用英文。
  - 第三方函式庫文件引用可保留原始語言。
  - Git commit 訊息可使用英文以利國際團隊協作。

**理由**：一致使用繁體中文確保主要使用者群的可及性，減少翻譯錯誤，並維持文化與語言的適當性。在程式碼（技術性／英文）與文件（使用者導向／繁體中文）之間建立清晰的語言界線，可防止混淆同時維持國際開發標準。

## Performance Standards

### Measurement & Monitoring

- **Real User Monitoring (RUM)**: Track actual user experience metrics (page load time, interaction latency, error rates).
- **Synthetic Monitoring**: Automated checks run every 5 minutes to catch issues before users do.
- **Performance Budget**: Each feature proposal MUST include estimated performance impact. Budget violations require optimization before merge.
- **Baseline Metrics**: Establish baseline performance metrics before each release. Post-release monitoring compares against baseline.

### Optimization Guidelines

- **Premature Optimization**: Avoid optimizing without evidence. Profile first, optimize hot paths only.
- **When to Optimize**: Optimize when metrics show user impact or approach limits (>150ms API response, >3s page load, >70% resource usage).
- **Optimization Process**: (1) Measure → (2) Identify bottleneck → (3) Optimize → (4) Measure again → (5) Document impact.

## Quality Assurance Process

### Pre-Merge Gates (Automated)

- All unit tests pass (required)
- All integration tests pass (required)
- Code coverage ≥80% (required)
- Linting passes with zero errors (required)
- Type checking passes (required)
- Security scan shows no high/critical vulnerabilities (required)

### Pre-Merge Gates (Manual)

- Code review approval from qualified reviewer (required)
- Design review for UI changes (required for user-facing changes)
- Performance review for high-traffic endpoints (required for API changes)
- Accessibility review for interactive elements (required for UI changes)

### Definition of Done

A feature is not complete until:

1. All tests written and passing
2. Code reviewed and approved
3. Documentation updated (API docs, user guides, etc.)
4. Performance validated against requirements
5. Accessibility validated (automated + manual testing)
6. Monitoring/logging configured
7. Deployed to staging and validated
8. Product owner sign-off

## Governance

This constitution supersedes all other development practices and policies. All team members MUST understand and follow these principles.

### Amendment Process

- **Proposal**: Any team member can propose amendments with justification.
- **Review Period**: Minimum 5 business days for team review and discussion.
- **Approval**: Requires consensus from at least 75% of active team members.
- **Migration Plan**: Breaking changes require documented migration path and timeline.
- **Version Update**: Follow semantic versioning (MAJOR.MINOR.PATCH).

### Compliance & Enforcement

- All code reviews MUST verify constitution compliance.
- CI/CD pipelines enforce automated gates.
- Quarterly constitution review meetings to assess effectiveness.
- Violations require either immediate fix or documented exception with expiration date.

### Exception Handling

- Exceptions require written justification and time-bound approval.
- Document reason, impact, remediation plan, and expiration date.
- Exceptions tracked in `.specify/memory/exceptions.md` (create if needed).
- Expired exceptions treated as violations.

### Living Document

- This constitution is reviewed quarterly and amended as needed.
- Amendments reflect lessons learned and evolving project needs.
- All team members contribute to keeping principles practical and relevant.

**版本**: 1.1.1 | **批准日期**: 2025-10-30 | **最後修訂**: 2025-10-31
