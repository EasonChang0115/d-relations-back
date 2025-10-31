# 研究文件：醫學細胞識別能力測驗平台

**分支**: `001-medical-cell-test` | **日期**: 2025-10-31 | **階段**: Phase 0 - Research

## 研究目標

本文件記錄在實作醫學細胞識別能力測驗平台過程中，針對技術選型、架構設計及關鍵功能實作的研究決策。所有研究項目皆來自 plan.md 中標記為「需研究」的技術問題。

---

## R1: 隨機出題演算法（確保團體測驗一致性）

### 研究問題

團體測驗要求同一批次的所有受測者必須收到相同的題目順序和圖片組合（100% 一致性），但又需要確保隨機性以防止題目外洩。如何在隨機性與一致性之間取得平衡？

### 決策

**採用 Seed-based 隨機演算法 + 批次 ID 作為種子值**

```typescript
// 實作概念
import { createHash } from "crypto";

class ExamService {
  generateQuestions(batchId: string, examType: string, questionCount: number) {
    // 使用批次 ID 作為隨機種子
    const seed = this.generateSeed(batchId);
    const rng = new SeededRandom(seed);

    // 從題庫中隨機選取題目
    const allQuestions = await this.getQuestionsByType(examType);
    const selectedQuestions = this.shuffle(allQuestions, rng).slice(
      0,
      questionCount
    );

    // 為每個題目隨機選擇圖片
    const questionsWithImages = selectedQuestions.map((q) => ({
      ...q,
      selectedImage: q.images[rng.nextInt(q.images.length)],
    }));

    return questionsWithImages;
  }

  private generateSeed(batchId: string): number {
    // 使用 SHA-256 雜湊批次 ID，取前 8 bytes 作為種子
    const hash = createHash("sha256").update(batchId).digest();
    return hash.readInt32BE(0);
  }
}
```

### 理由

1. **一致性保證**: 相同的批次 ID（種子）總是產生相同的隨機序列
2. **隨機性**: 不同批次 ID 產生不同的題目組合
3. **不可預測性**: 使用 UUID 作為批次 ID，無法事先預測題目
4. **效能**: 無需預先生成並儲存題目，動態生成即可

### 替代方案與捨棄原因

#### 方案 A: 預先生成並儲存題目

- **捨棄原因**:
  - 儲存成本高（每個批次需儲存 20 題 × N 個圖片 URL）
  - 資料庫查詢負擔重
  - 難以處理題庫更新（新增/刪除題目時需重新生成）

#### 方案 B: 使用 Math.random() 但儲存結果

- **捨棄原因**:
  - 無法重現相同結果（除錯困難）
  - 仍需儲存題目組合

#### 方案 C: 固定題目集（無隨機）

- **捨棄原因**:
  - 題目易外洩
  - 無法展現測驗公平性

### 實作細節

- **Seed 生成**: 使用 UUID v4 作為批次 ID，透過 SHA-256 雜湊生成數字種子
- **隨機演算法**: 使用 `seedrandom` 套件（Mersenne Twister 演算法）
- **題目快取**: 將生成的題目序列快取 10 天（與會話期限相同），減少重複計算
- **驗證機制**: 單元測試驗證相同種子產生相同題目順序

---

## R2: OTP 郵件發送最佳實踐

### 研究問題

OTP 驗證碼郵件需要在 1 分鐘內送達，並確保高送達率、防止濫用和良好的使用者體驗。如何設計可靠的 OTP 發送機制？

### 決策

**採用 Nodemailer + SMTP 供應商 + Rate Limiting + Retry 機制**

```typescript
// 實作概念
class OtpService {
  async sendOtp(email: string, deviceId: string) {
    // 1. 檢查速率限制
    await this.checkRateLimit(email);

    // 2. 生成 OTP（6 位數，10 分鐘有效）
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 3. 儲存 OTP 到資料庫
    await this.otpRepository.save({
      email,
      deviceId,
      otp,
      expiresAt,
      attempts: 0,
      verified: false,
    });

    // 4. 發送郵件（非同步，使用 Queue）
    await this.mailQueue.add(
      "send-otp",
      {
        to: email,
        otp,
        expiresAt,
        template: "otp-verification",
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
      }
    );
  }

  private async checkRateLimit(email: string) {
    const lastSent = await this.redis.get(`otp:last_sent:${email}`);
    if (lastSent && Date.now() - parseInt(lastSent) < 60000) {
      throw new TooManyRequestsException("請等待 60 秒後再重新發送");
    }
    await this.redis.set(`otp:last_sent:${email}`, Date.now(), "EX", 60);
  }
}
```

### 理由

1. **高送達率**: 使用專業 SMTP 服務（SendGrid / AWS SES）
2. **速率限制**: 防止濫用，符合規格要求（60 秒間隔）
3. **Retry 機制**: 確保郵件送達
4. **非同步處理**: 不阻塞 API 回應

### 替代方案與捨棄原因

#### 方案 A: 使用 Gmail SMTP

- **捨棄原因**:
  - 每日發送限制（500 封/天）
  - 送達率不穩定
  - 不適合生產環境

#### 方案 B: 使用 Twilio SMS 取代郵件

- **捨棄原因**:
  - 成本高（每則 SMS 約 $0.05 USD）
  - 規格要求使用郵件驗證

#### 方案 C: 同步發送郵件

- **捨棄原因**:
  - 阻塞 API 回應（SMTP 連線可能延遲）
  - 無法處理發送失敗

### 實作細節

- **SMTP 供應商**: AWS SES（首選）或 SendGrid（備選）
- **郵件範本**: Handlebars 模板引擎，支援多語言
- **Queue 系統**: Bull Queue + Redis，處理郵件發送任務
- **Retry 策略**: 指數退避（2s, 4s, 8s），最多 3 次重試
- **監控**: 追蹤郵件發送成功率、平均送達時間
- **Rate Limiting**: Redis 儲存最後發送時間戳，60 秒窗口

**郵件範本內容**:

- 主旨: `【醫學細胞測驗】您的驗證碼`
- 內容: OTP 碼（大字體）、有效時間、安全提示、客服聯絡方式
- 風格: 簡潔、專業、易讀

---

## R3: Stripe Webhook 安全處理

### 研究問題

如何安全地處理 Stripe 付款確認 Webhook，確保付款狀態正確更新，並防止重放攻擊和未授權請求？

### 決策

**採用 Stripe Webhook 簽章驗證 + Idempotency Key + 事件處理佇列**

```typescript
// 實作概念
@Controller("payments")
export class PaymentsController {
  @Post("webhook")
  @Header("content-type", "application/json")
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = this.configService.get("STRIPE_WEBHOOK_SECRET");

    let event: Stripe.Event;

    try {
      // 1. 驗證簽章
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        endpointSecret
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // 2. 檢查事件是否已處理（防止重放）
    const processed = await this.redis.get(`stripe:event:${event.id}`);
    if (processed) {
      return { received: true };
    }

    // 3. 加入處理佇列
    await this.paymentQueue.add("process-webhook", {
      eventId: event.id,
      type: event.type,
      data: event.data.object,
    });

    // 4. 標記事件已接收（7 天過期）
    await this.redis.set(`stripe:event:${event.id}`, "1", "EX", 604800);

    return { received: true };
  }
}

// Webhook 處理器
class PaymentWebhookProcessor {
  async process(job: Job) {
    const { eventId, type, data } = job.data;

    switch (type) {
      case "checkout.session.completed":
        await this.handleCheckoutCompleted(data);
        break;
      case "payment_intent.succeeded":
        await this.handlePaymentSucceeded(data);
        break;
      case "payment_intent.payment_failed":
        await this.handlePaymentFailed(data);
        break;
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    // 更新付款記錄
    await this.paymentRepository.update(
      { checkoutSessionId: session.id },
      { status: "completed", paidAt: new Date() }
    );

    // 建立測驗會話
    await this.examService.createExamSession(
      session.metadata.userId,
      session.metadata.examType
    );

    // 發送測驗連結郵件
    await this.mailService.sendExamLink(session.customer_email);
  }
}
```

### 理由

1. **安全性**: 簽章驗證確保請求來自 Stripe
2. **冪等性**: 防止重複處理相同事件
3. **可靠性**: 非同步處理，失敗可重試
4. **效能**: 快速回應 Webhook，不阻塞 Stripe

### 替代方案與捨棄原因

#### 方案 A: 同步處理 Webhook

- **捨棄原因**:
  - 阻塞 Stripe Webhook（超過 5 秒會重試）
  - 無法處理複雜業務邏輯

#### 方案 B: 不驗證簽章

- **捨棄原因**:
  - 安全風險（任何人都可偽造 Webhook）
  - Stripe 官方強烈建議驗證

#### 方案 C: 輪詢 Stripe API 取代 Webhook

- **捨棄原因**:
  - 延遲高（至少 1 分鐘）
  - API 請求配額浪費

### 實作細節

- **Raw Body 保留**: NestJS 需保留原始請求 body 以驗證簽章
- **Webhook Secret**: 從 Stripe Dashboard 取得，儲存在環境變數
- **事件類型**: 監聽 `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
- **Retry 策略**: Bull Queue 自動重試（3 次），指數退避
- **監控**: 記錄所有 Webhook 事件，追蹤處理成功率
- **測試**: 使用 Stripe CLI 本地測試 Webhook

**安全檢查清單**:

- ✅ 驗證 Stripe 簽章
- ✅ 檢查事件 ID 是否已處理
- ✅ 驗證 metadata 與資料庫記錄一致
- ✅ 使用 HTTPS（生產環境）
- ✅ 限制 Webhook 端點僅接受 Stripe IP

---

## R4: PDF 生成效能優化

### 研究問題

當系統支援 100 位使用者同時完成測驗並請求 PDF 報表時，如何確保 PDF 生成時間 <5 秒，且不影響其他 API 效能？

### 決策

**採用 pdf-lib + 背景任務佇列 + S3 快取 + 模板預渲染**

```typescript
// 實作概念
class ReportService {
  async generatePdfReport(examId: string): Promise<string> {
    // 1. 檢查快取（S3）
    const cachedUrl = await this.checkCache(examId);
    if (cachedUrl) return cachedUrl;

    // 2. 加入背景任務佇列
    const job = await this.reportQueue.add(
      "generate-pdf",
      {
        examId,
        priority: 1,
      },
      {
        attempts: 3,
        timeout: 10000, // 10 秒超時
        backoff: { type: "fixed", delay: 1000 },
      }
    );

    // 3. 返回任務 ID（前端輪詢狀態）
    return job.id;
  }

  async processPdfGeneration(job: Job) {
    const { examId } = job.data;

    // 載入資料
    const [exam, answers, user] = await Promise.all([
      this.examRepository.findOne(examId),
      this.answerRepository.findByExam(examId),
      this.userRepository.findOne(exam.userId),
    ]);

    // 使用 pdf-lib 生成 PDF
    const pdfDoc = await PDFDocument.create();

    // 載入預渲染的範本
    const templateBytes = await this.loadTemplate("exam-report.pdf");
    const templateDoc = await PDFDocument.load(templateBytes);

    // 複製範本頁面
    const [templatePage] = await pdfDoc.copyPages(templateDoc, [0]);
    pdfDoc.addPage(templatePage);

    // 填入動態內容（使用 pdf-lib 繪製文字）
    const page = pdfDoc.getPage(0);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText(user.name, { x: 100, y: 700, font, size: 16 });
    page.drawText(`正答率: ${exam.accuracy}%`, {
      x: 100,
      y: 650,
      font,
      size: 14,
    });

    // 生成 PDF Buffer
    const pdfBytes = await pdfDoc.save();

    // 上傳到 S3
    const key = `reports/${examId}.pdf`;
    await this.s3Service.upload(key, pdfBytes, "application/pdf");

    // 產生預簽章 URL（1 小時有效）
    const url = await this.s3Service.getSignedUrl(key, 3600);

    // 快取 URL（1 個月）
    await this.redis.set(`pdf:${examId}`, url, "EX", 2592000);

    return url;
  }
}
```

### 理由

1. **非阻塞**: 背景任務不影響 API 回應
2. **快取**: 避免重複生成相同 PDF
3. **效能**: pdf-lib 純 JavaScript 實作，無需外部依賴
4. **擴展性**: 佇列系統支援水平擴展

### 替代方案與捨棄原因

#### 方案 A: 使用 Puppeteer 渲染 HTML

- **捨棄原因**:
  - 記憶體消耗高（每個實例 ~100MB）
  - 啟動時間慢（需啟動 Chromium）
  - 不適合高並發場景

#### 方案 B: 同步生成 PDF

- **捨棄原因**:
  - 阻塞 API 回應（生成時間 2-5 秒）
  - 無法處理並發請求

#### 方案 C: 使用 PDFKit

- **捨棄原因**:
  - 功能較少（不支援模板載入）
  - 社群支援較弱

### 實作細節

- **PDF 套件**: pdf-lib v1.17.1（純 JavaScript，無依賴）
- **字型**: 嵌入 Noto Sans CJK（支援繁體中文）
- **範本設計**: 使用 Adobe Acrobat 預先設計 PDF 範本
- **圖片處理**: 細胞圖片從 S3 載入，嵌入 PDF
- **佇列設定**: Bull Queue，最多 5 個並發任務
- **監控**: 追蹤 PDF 生成時間、失敗率、佇列長度

**效能目標**:

- 單個 PDF 生成: <3 秒
- 100 個並發請求: 平均 <5 秒完成
- 記憶體消耗: <50MB per PDF

---

## R5: 多語言 i18n 實作方案

### 研究問題

系統需支援多語言介面（繁體中文、英文、日文等），如何在 NestJS 中實作可配置的多語言支援，並確保 API 回應、錯誤訊息、郵件範本都能正確國際化？

### 決策

**採用 nestjs-i18n + JSON 翻譯檔 + Accept-Language Header**

```typescript
// 實作概念
// app.module.ts
@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'zh-TW',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-custom-lang']),
      ],
    }),
  ],
})
export class AppModule {}

// Controller 使用
@Controller('exams')
export class ExamsController {
  @Get()
  async findAll(@I18n() i18n: I18nContext) {
    return {
      message: await i18n.t('exam.list_success'),
      data: await this.examService.findAll()
    };
  }

  @Post()
  async create(@Body() dto: CreateExamDto, @I18n() i18n: I18nContext) {
    try {
      return await this.examService.create(dto);
    } catch (error) {
      throw new BadRequestException(
        await i18n.t('exam.create_failed', { args: { reason: error.message } })
      );
    }
  }
}

// 翻譯檔結構
// i18n/zh-TW/exam.json
{
  "list_success": "成功取得測驗列表",
  "create_failed": "建立測驗失敗：{reason}",
  "not_found": "找不到測驗",
  "start_success": "測驗已開始",
  "submit_success": "答案已提交"
}

// i18n/en/exam.json
{
  "list_success": "Successfully retrieved exam list",
  "create_failed": "Failed to create exam: {reason}",
  "not_found": "Exam not found",
  "start_success": "Exam started",
  "submit_success": "Answer submitted"
}

// i18n/ja/exam.json
{
  "list_success": "試験リストを取得しました",
  "create_failed": "試験の作成に失敗しました：{reason}",
  "not_found": "試験が見つかりません",
  "start_success": "試験を開始しました",
  "submit_success": "回答を送信しました"
}
```

### 理由

1. **官方支援**: nestjs-i18n 是 NestJS 官方推薦的 i18n 解決方案
2. **靈活性**: 支援多種語言偵測策略（Query, Header, Cookie）
3. **型別安全**: 提供 TypeScript 型別提示
4. **易維護**: JSON 翻譯檔結構清晰

### 替代方案與捨棄原因

#### 方案 A: 手動實作 i18n

- **捨棄原因**:
  - 開發成本高
  - 容易出錯
  - 缺乏型別安全

#### 方案 B: 使用 i18next 直接整合

- **捨棄原因**:
  - 整合複雜度高
  - 與 NestJS 生態系統不一致
  - nestjs-i18n 已封裝 i18next

#### 方案 C: 資料庫儲存翻譯

- **捨棄原因**:
  - 查詢效能差
  - 部署複雜（需同步翻譯）
  - 不適合靜態翻譯

### 實作細節

- **套件**: nestjs-i18n v10.4.0
- **翻譯檔位置**: `src/i18n/{語言碼}/` (zh-TW, en, ja)
- **語言偵測順序**:
  1. Query Parameter: `?lang=zh-TW`
  2. Accept-Language Header
  3. 預設語言: zh-TW (繁體中文)
- **翻譯範疇**:
  - API 回應訊息
  - 錯誤訊息（統一在 HTTP Exception Filter）
  - 郵件範本（使用 i18n.t() 在 Handlebars 範本）
  - DTO 驗證錯誤訊息
- **快取策略**: 翻譯檔載入後快取在記憶體，開發環境啟用 watch 模式

**翻譯檔組織**:

```
i18n/
├── zh-TW/
│   ├── common.json       # 通用訊息
│   ├── auth.json         # 認證相關
│   ├── exam.json         # 測驗相關
│   ├── payment.json      # 付款相關
│   ├── mail.json         # 郵件範本
│   └── validation.json   # 驗證錯誤
├── en/
│   └── ...
└── ja/
    └── ...
```

---

## R6: 會話管理與裝置追蹤

### 研究問題

OTP 驗證後，系統需記住同一裝置/瀏覽器在 10 天內無需重新驗證。如何實作跨請求的會話管理和裝置識別？

### 決策

**採用 JWT Refresh Token + Device Fingerprinting + Redis Session Store**

```typescript
// 實作概念
class SessionService {
  async createSession(userId: string, deviceId: string, userAgent: string) {
    // 生成 Access Token (1 小時有效)
    const accessToken = this.jwtService.sign(
      { sub: userId, type: "access" },
      { expiresIn: "1h" }
    );

    // 生成 Refresh Token (10 天有效)
    const refreshToken = this.jwtService.sign(
      { sub: userId, deviceId, type: "refresh" },
      { expiresIn: "10d" }
    );

    // 儲存會話資訊到 Redis（10 天過期）
    const sessionKey = `session:${userId}:${deviceId}`;
    await this.redis.set(
      sessionKey,
      JSON.stringify({
        userId,
        deviceId,
        userAgent,
        createdAt: new Date(),
        lastActivityAt: new Date(),
      }),
      "EX",
      864000
    ); // 10 天

    return { accessToken, refreshToken };
  }

  async validateSession(refreshToken: string, deviceId: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      // 驗證裝置 ID 是否匹配
      if (payload.deviceId !== deviceId) {
        throw new UnauthorizedException("Device mismatch");
      }

      // 檢查 Redis 會話是否存在
      const sessionKey = `session:${payload.sub}:${deviceId}`;
      const session = await this.redis.get(sessionKey);

      if (!session) {
        throw new UnauthorizedException("Session expired");
      }

      // 更新最後活動時間
      const sessionData = JSON.parse(session);
      sessionData.lastActivityAt = new Date();
      await this.redis.set(
        sessionKey,
        JSON.stringify(sessionData),
        "EX",
        864000
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  async revokeSession(userId: string, deviceId: string) {
    const sessionKey = `session:${userId}:${deviceId}`;
    await this.redis.del(sessionKey);
  }
}

// Device Fingerprinting
class DeviceService {
  generateDeviceId(req: Request): string {
    const components = [
      req.ip,
      req.headers["user-agent"],
      req.headers["accept-language"],
      req.headers["accept-encoding"],
    ];

    // 生成裝置指紋（SHA-256 雜湊）
    const fingerprint = createHash("sha256")
      .update(components.join("|"))
      .digest("hex");

    return fingerprint;
  }
}
```

### 理由

1. **安全性**: JWT 不可偽造，Refresh Token 綁定裝置
2. **擴展性**: Redis Session 支援水平擴展
3. **效能**: JWT 無需查詢資料庫，僅驗證簽章
4. **靈活性**: 可隨時撤銷會話（刪除 Redis key）

### 替代方案與捨棄原因

#### 方案 A: Cookie-based Session

- **捨棄原因**:
  - 不支援跨域（API 與前端可能不同域名）
  - 無法用於行動 App

#### 方案 B: 僅使用 JWT Access Token

- **捨棄原因**:
  - 無法撤銷（JWT 有效期限內永久有效）
  - 10 天有效期太長（安全風險）

#### 方案 C: 資料庫儲存 Session

- **捨棄原因**:
  - 查詢效能差
  - 資料庫負擔重

### 實作細節

- **JWT Secret**: 儲存在環境變數，256-bit 以上
- **Token 位置**: Refresh Token 儲存在 httpOnly Cookie，Access Token 在 Authorization Header
- **Device Fingerprint**: 使用 IP + User-Agent + Accept-Language + Accept-Encoding 組合雜湊
- **管理者會話**: 1 小時無操作自動過期（縮短 Redis TTL）
- **受測者會話**: 10 天有效期
- **多裝置支援**: 同一使用者可在多個裝置登入（不同 deviceId）

**安全考量**:

- ✅ Refresh Token 使用 httpOnly Cookie（防 XSS）
- ✅ CSRF Token 保護
- ✅ 裝置 ID 綁定（防 Token 被盜用）
- ✅ 會話可撤銷（Redis 刪除）
- ✅ 定期輪換 JWT Secret

---

## R7: 題庫規模計算

### 研究問題

為確保題目不重複且維持隨機性，末梢血版和骨髓版各需要多少題目？如何平衡題庫規模與維護成本？

### 決策

**末梢血版: 100 題，骨髓版: 100 題（每種細胞類型 10 張圖片）**

### 計算邏輯

```
假設細胞類型數量:
- 末梢血版: 10 種細胞類型
- 骨髓版: 15 種細胞類型

單次測驗題目數:
- 免費版: 15 題
- 付費版: 20 題

最小題庫規模（避免短期重複）:
- 末梢血版: 15 題 × 5 次測驗 = 75 題（建議 100 題）
- 骨髓版: 20 題 × 5 次測驗 = 100 題

圖片需求:
- 每種細胞 10 張圖片（規格要求）
- 末梢血版: 10 種 × 10 張 = 100 張圖片
- 骨髓版: 15 種 × 10 張 = 150 張圖片
```

### 理由

1. **隨機性**: 100 題足以確保同一使用者短期內（5 次測驗）不會遇到重複題目
2. **維護成本**: 題庫規模適中，易於管理和更新
3. **擴展性**: 可隨時新增題目而不影響現有功能

### 實作細節

- **初始題庫**: MVP 階段各 100 題
- **擴展計畫**: 根據使用量逐步增加至 200 題
- **題目標籤**: 每題標記難度（簡單/中等/困難）、細胞類型、來源
- **圖片儲存**: AWS S3，每張圖片 <500KB（壓縮後）
- **定期審查**: 每季檢視題目品質，淘汰不佳題目

---

## R8: Stripe 付款流程設計

### 研究問題

如何設計完整的 Stripe 付款流程，包含價格設定、Checkout Session、付款確認及錯誤處理？

### 決策

**採用 Stripe Checkout Session + Metadata + Webhook 確認**

```typescript
// 實作概念
class PaymentService {
  async createCheckoutSession(
    userId: string,
    examType: "individual" | "group",
    quantity: number = 1
  ) {
    // 建立付款記錄
    const payment = await this.paymentRepository.save({
      userId,
      examType,
      quantity,
      amount: this.calculateAmount(examType, quantity),
      status: "pending",
      createdAt: new Date(),
    });

    // 建立 Stripe Checkout Session
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "twd",
            product_data: {
              name:
                examType === "individual" ? "付費版個人測驗" : "付費版團體測驗",
              description: `細胞識別測驗 - ${quantity} 人份`,
            },
            unit_amount: this.calculateAmount(examType, 1) * 100, // Stripe 使用分為單位
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.WEB_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.WEB_URL}/payment/cancel`,
      metadata: {
        paymentId: payment.id,
        userId,
        examType,
        quantity: quantity.toString(),
      },
    });

    // 更新付款記錄
    await this.paymentRepository.update(payment.id, {
      checkoutSessionId: session.id,
    });

    return { sessionId: session.id, url: session.url };
  }

  private calculateAmount(
    examType: "individual" | "group",
    quantity: number
  ): number {
    const prices = {
      individual: 500, // TWD $500/人
      group: 400, // TWD $400/人（團體優惠）
    };
    return prices[examType] * quantity;
  }
}
```

### 理由

1. **安全性**: Stripe Hosted Checkout 頁面，無需處理信用卡資訊
2. **使用者體驗**: Stripe 提供完整的付款介面（多語言、多種付款方式）
3. **可靠性**: Webhook 確保付款狀態同步

### 實作細節

- **價格**: 個人測驗 TWD $500，團體測驗 TWD $400/人
- **付款方式**: 信用卡（Visa, Mastercard, JCB）
- **貨幣**: TWD (台幣)
- **測試模式**: 開發環境使用 Stripe Test Mode
- **退款政策**: 測驗開始前可全額退款（透過 Stripe Dashboard 手動處理）

---

## 研究總結

所有技術決策已完成研究，關鍵技術選型如下：

| 技術領域       | 選用方案                     | 理由                  |
| -------------- | ---------------------------- | --------------------- |
| 隨機出題       | Seed-based 演算法            | 一致性 + 效能         |
| OTP 發送       | Nodemailer + AWS SES + Queue | 高送達率 + 速率限制   |
| Stripe Webhook | 簽章驗證 + Idempotency       | 安全性 + 可靠性       |
| PDF 生成       | pdf-lib + 背景任務 + S3 快取 | 效能 + 擴展性         |
| 多語言         | nestjs-i18n + JSON 翻譯檔    | 官方支援 + 易維護     |
| 會話管理       | JWT Refresh Token + Redis    | 安全性 + 擴展性       |
| 題庫規模       | 100 題/版本                  | 隨機性 + 維護成本平衡 |
| Stripe 付款    | Checkout Session + Webhook   | 安全性 + 使用者體驗   |

**下一步**: 進入 Phase 1 - 資料模型設計與 API 合約定義。
