<!--
Sync Impact Report - Constitution Update
═══════════════════════════════════════════════════════════════════════════════
Version Change: N/A (initial) → 1.0.0
Rationale: Initial constitution establishing foundational governance principles

Modified Principles:
  - N/A (initial creation)

Added Sections:
  - I. Code Quality Standards (NON-NEGOTIABLE)
  - II. Testing Standards (NON-NEGOTIABLE)
  - III. User Experience Consistency
  - IV. Performance Requirements
  - Performance Standards (detailed metrics and monitoring)
  - Quality Assurance Process (gates and reviews)

Removed Sections:
  - N/A

Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section already aligned
  ✅ spec-template.md - Acceptance scenarios and requirements align with UX/testing
  ✅ tasks-template.md - Task phases support test-first and quality gates
  ⚠ All command files in .github/prompts/ - Should be reviewed for principle references

Follow-up TODOs:
  - None (all placeholders filled)

Generated: 2025-10-30
═══════════════════════════════════════════════════════════════════════════════
-->

# Speck-Kit Demo Constitution

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

**Version**: 1.0.0 | **Ratified**: 2025-10-30 | **Last Amended**: 2025-10-30
