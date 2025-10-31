# 後端專案技術規格文件

> 本文件記錄專案的技術架構、技術棧選型、開發規範與部署配置

---

## 📋 專案資訊

此份技術規格文件旨在詳細描述後端專案的技術架構與開發規範，為團隊成員提供一致的參考標準，確保專案的可維護性與擴展性。(不包含前端)

### 基本資訊
- **專案名稱**: [專案名稱]
- **版本**: [版本號]
- **開發團隊**: [團隊名稱]
- **專案類型**: Web API
- **授權方式**: [授權類型]
- **Git 分支**: [develop / main]

### 專案目標
[簡述專案的主要目標與核心功能]

---

## 🔧 技術棧

### 後端技術

#### 核心框架
- **主框架**: NestJS v11.0.1
- **程式語言**: TypeScript v5.7.3
  - 編譯目標: ES2023
  - 模組系統: CommonJS
- **執行環境**: Node.js

#### 資料庫
- **主資料庫**: MySQL v8.0
- **ORM 框架**: TypeORM v0.3.25
- **資料庫驅動**: mysql2 v3.14.2

#### 身份驗證與授權
- **驗證框架**: Passport.js v0.7.0
- **JWT 處理**: @nestjs/jwt v11.0.0, passport-jwt v4.0.1
- **OAuth 策略**:
  - Google OAuth 2.0: passport-google-oauth20 v2.0.0
  - Facebook: passport-facebook v3.0.0
  - LINE: passport-line v0.0.4
- **密碼加密**: bcrypt v6.0.0

### 主要套件

#### API 文檔
- **Swagger**: @nestjs/swagger v11.2.0
- **UI**: swagger-ui-express v5.0.1

#### 檔案儲存
- **雲端儲存**: AWS SDK (@aws-sdk/client-s3 v3.846.0)
- **檔案上傳**: multer v2.0.1, multer-s3 v3.0.1

#### 郵件服務
- **NestJS 整合**: @nestjs-modules/mailer v2.0.2
- **郵件傳輸**: nodemailer v7.0.5

#### 資料驗證與處理
- **請求驗證**: class-validator v0.14.2
- **資料轉換**: class-transformer v0.5.1
- **環境變數驗證**: joi v17.13.3
- **日期處理**: date-fns v4.1.0

#### 其他工具
- **Excel 處理**: exceljs v4.4.0
- **PDF 產生**: pdf-lib v1.17.1
- **Reactive 程式設計**: rxjs v7.8.1
- **時間工具**: ms v2.1.3

### 開發工具

#### 測試框架
- **測試框架**: Jest v29.7.0
- **TypeScript 整合**: ts-jest v29.2.5
- **E2E 測試**: supertest v7.0.0
- **NestJS 測試工具**: @nestjs/testing v11.0.1

#### 程式碼品質
- **程式碼檢查**: ESLint v9.18.0
  - TypeScript ESLint: typescript-eslint v8.20.0
  - Prettier 整合: eslint-plugin-prettier v5.2.2
- **程式碼格式化**: Prettier v3.4.2

#### 建置工具
- **快速編譯器**: SWC (@swc/core v1.10.7, @swc/cli v0.6.0)
- **TypeScript 載入器**: ts-loader v9.5.2
- **執行工具**: ts-node v10.9.2
- **路徑對應**: tsconfig-paths v4.2.0
- **NestJS CLI**: @nestjs/cli v11.0.0

---

## 🏛️ 專案架構

### 目錄結構

```
project-root/
├── src/
│   ├── application/          # 應用層（主要業務邏輯）
│   │   ├── [module-a]/      # 功能模組 A
│   │   │   ├── [feature].controller.ts
│   │   │   ├── [feature].service.ts
│   │   │   ├── [feature].module.ts
│   │   │   ├── dto/         # 資料傳輸物件
│   │   │   ├── response/    # 回應格式定義
│   │   │   └── transformers/ # 資料轉換器（如適用）
│   │   ├── [module-b]/      # 功能模組 B
│   │   └── app.module.ts    # 主模組
│   ├── entities/            # 資料庫實體定義
│   │   ├── [entity-1].entity.ts
│   │   └── [entity-2].entity.ts
│   ├── common/              # 共用元件
│   │   ├── api-docs/        # API 文檔相關
│   │   │   ├── response/    # Swagger 回應定義
│   │   │   └── tags/        # Swagger 標籤定義
│   │   ├── filters/         # 異常過濾器
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/    # 攔截器
│   │   │   └── response.interceptor.ts
│   │   ├── guards/          # 守衛（如：JWT Auth Guard）
│   │   ├── decorators/      # 自訂裝飾器
│   │   └── middleware/      # 中介軟體
│   │       └── logger.middleware.ts
│   ├── config/              # 設定檔
│   │   ├── configuration.ts # 主要設定物件
│   │   ├── validation.ts    # 環境變數驗證
│   │   └── index.ts         # 匯出模組
│   ├── [service-modules]/   # 服務模組（如：mail, s3）
│   │   ├── [service].module.ts
│   │   ├── [service].service.ts
│   │   └── [config].options.ts
│   ├── utils/               # 工具函數
│   ├── seeds/               # 資料庫種子資料
│   ├── main.ts              # 應用程式入口
│   └── seed.ts              # 種子資料執行入口
├── test/                    # 測試檔案
│   ├── [module].e2e-spec.ts
│   └── jest-e2e.json
├── docker/                  # Docker 相關（或根目錄 docker-compose.yml）
├── docs/                    # 文檔
├── dist/                    # 編譯輸出（.gitignore）
├── node_modules/            # 依賴套件（.gitignore）
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── eslint.config.mjs
├── Makefile                 # 常用指令快捷鍵
└── README.md
```

### 架構模式
- **設計模式**: Module-Controller-Service (NestJS MVC)
- **程式碼組織**: Feature-based Modules
- **依賴注入**: NestJS IoC Container

### 模組結構範例

每個功能模組通常包含：
```
[module-name]/
├── [feature].controller.ts    # 處理 HTTP 請求
├── [feature].service.ts        # 業務邏輯層
├── [feature].module.ts         # 模組定義
├── dto/                        # 資料傳輸物件
│   ├── create-[feature].dto.ts
│   ├── update-[feature].dto.ts
│   └── query-[feature].dto.ts
├── response/                   # 回應格式（Swagger）
│   └── [feature].response.ts
└── transformers/               # 資料轉換器（可選）
    └── [feature].transformer.ts
```

---

## 🗄️ 資料模型設計

### 實體定義規範

使用 TypeORM 裝飾器定義實體：

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('[table_name]')
export class EntityName {
  @PrimaryGeneratedColumn('uuid')  // 或 'increment'
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: EnumType, default: EnumType.DEFAULT })
  status: EnumType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;  // 軟刪除

  // 關聯
  @ManyToOne(() => RelatedEntity, (related) => related.entities)
  @JoinColumn({ name: 'related_id' })
  related: RelatedEntity;

  @OneToMany(() => ChildEntity, (child) => child.parent)
  children: ChildEntity[];
}
```

### 資料庫設計原則
- **主鍵策略**: UUID (通用唯一識別碼) 或 Auto Increment
- **命名規範**: snake_case（資料庫）、camelCase（TypeScript）
- **時間戳記**: 統一使用 `created_at`, `updated_at`
- **軟刪除**: 使用 `deleted_at` 欄位，不實際刪除資料
- **列舉類型**: 使用 TypeScript enum 配合 MySQL ENUM
- **外鍵關聯**: 使用 TypeORM 裝飾器定義關聯
- **索引策略**: 常查詢欄位、外鍵、唯一性欄位

### 核心實體範例

#### [Entity 1] - [說明]
- **用途**: [實體用途說明]
- **關聯**: 
  - 與 [Entity 2] 為一對多關係
  - 與 [Entity 3] 為多對一關係

#### [Entity 2] - [說明]
- **用途**: [實體用途說明]
- **特殊欄位**: [特殊設計說明]

---

## 🔌 API 設計規範

### API 基本原則
- **RESTful 設計**: 遵循 REST 架構風格
- **統一前綴**: `/api` 作為所有 API 的前綴
- **版本策略**: URL versioning（如需要：`/api/v1/`）
- **HTTP 方法**:
  - `GET`: 查詢資源（單筆或列表）
  - `POST`: 建立新資源
  - `PUT`: 完整更新資源
  - `PATCH`: 部分更新資源
  - `DELETE`: 刪除資源

### 端點命名規範
```
GET    /api/[resources]              # 取得資源列表
GET    /api/[resources]/:id          # 取得單一資源
POST   /api/[resources]              # 建立新資源
PUT    /api/[resources]/:id          # 完整更新資源
PATCH  /api/[resources]/:id          # 部分更新資源
DELETE /api/[resources]/:id          # 刪除資源
```

### 模組分類範例

#### 認證模組 (`/api/auth/*`)
```
POST   /api/auth/login               # 一般登入
POST   /api/auth/register            # 註冊
POST   /api/auth/logout              # 登出
POST   /api/auth/refresh-token       # 刷新 Token
POST   /api/auth/forgot-password     # 忘記密碼
POST   /api/auth/reset-password      # 重設密碼
GET    /api/auth/google              # Google OAuth
GET    /api/auth/google/callback     # Google OAuth 回調
GET    /api/auth/facebook            # Facebook OAuth
GET    /api/auth/line                # LINE OAuth
```

#### 使用者模組 (`/api/users/*`)
```
GET    /api/users/profile            # 取得個人資料
PUT    /api/users/profile            # 更新個人資料
POST   /api/users/avatar             # 上傳頭像
PUT    /api/users/password           # 修改密碼
GET    /api/users/:id                # 取得指定使用者資料（公開）
```

#### [其他功能模組] (`/api/[module]/*`)
[依照專案實際功能定義]

### 統一回應格式

#### 成功回應（使用 Response Interceptor）
```typescript
{
  "success": true,
  "statusCode": 200,
  "message": "操作成功",
  "data": {
    // 實際資料
  }
}
```

#### 錯誤回應（使用 HTTP Exception Filter）
```typescript
{
  "success": false,
  "statusCode": 400,
  "message": "錯誤訊息",
  "error": "BadRequestException",
  "timestamp": "2025-10-31T12:00:00.000Z",
  "path": "/api/[endpoint]"
}
```

#### 分頁回應格式
```typescript
{
  "success": true,
  "data": {
    "items": [...],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 查詢參數規範
```
# 分頁
?page=1&limit=20

# 排序
?sortBy=created_at&order=DESC

# 篩選
?status=active&category=news

# 搜尋
?search=keyword

# 欄位選擇
?fields=id,name,email
```

### Swagger 文檔整合

使用 NestJS Swagger 裝飾器：

```typescript
@Controller('[resources]')
@ApiTags('[Resource]')  // Swagger 分類標籤
export class ResourceController {
  
  @Get()
  @ApiOperation({ summary: '取得資源列表' })
  @ApiResponse({ status: 200, description: '成功', type: [ResourceResponse] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async findAll(@Query() query: QueryDto) {
    // ...
  }

  @Post()
  @ApiOperation({ summary: '建立新資源' })
  @ApiResponse({ status: 201, description: '建立成功' })
  @ApiBody({ type: CreateResourceDto })
  async create(@Body() createDto: CreateResourceDto) {
    // ...
  }
}
```

---

## 🔐 安全性設計

### 身份驗證流程

#### JWT Token 流程
1. 使用者登入 → 驗證帳號密碼
2. 驗證成功 → 簽發 Access Token 與 Refresh Token
3. 客戶端儲存 Token（建議使用 httpOnly Cookie）
4. 後續請求在 Header 帶上 `Authorization: Bearer <token>`
5. 伺服器驗證 Token 有效性
6. Token 過期 → 使用 Refresh Token 取得新 Token

#### OAuth 流程
1. 使用者點擊第三方登入
2. 導向 OAuth Provider 授權頁面
3. 使用者授權 → 回調至 `/auth/[provider]/callback`
4. 後端取得使用者資訊 → 建立或綁定帳號
5. 簽發 JWT Token

### JWT 策略實作

使用 Passport JWT Strategy：

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### 路由保護

使用 Guard 保護路由：

```typescript
@Controller('[resource]')
export class ResourceController {
  
  @UseGuards(JwtAuthGuard)  // 需要登入
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)  // 需要特定角色
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    // ...
  }
}
```

### 安全措施

#### CORS 設定
```typescript
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN.split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});
```

#### 安全檢查清單
- ✅ **HTTPS**: 生產環境強制使用
- ✅ **CORS**: 限制允許的來源
- ✅ **Helmet**: 設定安全相關 HTTP Headers
- ✅ **Rate Limiting**: 防止 API 濫用
- ✅ **Input Validation**: 使用 class-validator 驗證所有輸入
- ✅ **SQL Injection**: TypeORM 參數化查詢
- ✅ **XSS**: 輸入驗證、輸出編碼
- ✅ **密碼儲存**: bcrypt 雜湊（不可逆）
- ✅ **敏感資料**: 環境變數管理，不提交到版控
- ✅ **檔案上傳**: 檔案類型、大小限制

### 權限控制

#### 角色定義
```typescript
export enum UserRole {
  ADMIN = 'admin',      // 管理員
  USER = 'user',        // 一般使用者
  GUEST = 'guest',      // 訪客
}

export enum Permission {
  DEFAULT = 'default',     // 正常權限
  BLACKLIST = 'blacklist', // 黑名單
}
```

#### 基於角色的存取控制（RBAC）
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

---

## 🛠️ 開發規範

### 程式碼風格

#### TypeScript 命名規範
```typescript
// 類別、介面、型別: PascalCase
class UserService {}
interface UserInterface {}
type UserType = {};

// 變數、函數、方法: camelCase
const userName = 'John';
function getUserName() {}

// 常數: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;

// 列舉: PascalCase (列舉值可用 UPPER_SNAKE_CASE)
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// 私有成員: 前綴 private（不使用底線）
private userRepository: Repository<User>;

// 檔案名稱: kebab-case
// user-profile.service.ts
// create-user.dto.ts
```

#### 檔案命名慣例
- Controller: `[feature].controller.ts`
- Service: `[feature].service.ts`
- Module: `[feature].module.ts`
- Entity: `[entity-name].entity.ts`
- DTO: `[action]-[entity].dto.ts`（如：`create-user.dto.ts`）
- Response: `[entity].response.ts`
- Guard: `[name].guard.ts`
- Decorator: `[name].decorator.ts`

### NestJS 最佳實踐

#### 模組結構
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Entity]),
    JwtModule,
    // 其他模組
  ],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService], // 如需被其他模組使用
})
export class FeatureModule {}
```

#### DTO 驗證
```typescript
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '使用者名稱' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: '電子郵件' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: '電話號碼' })
  @IsOptional()
  @IsString()
  phone?: string;
}
```

#### Service 層設計
```typescript
@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Entity)
    private entityRepository: Repository<Entity>,
    private otherService: OtherService,
  ) {}

  async findAll(query: QueryDto): Promise<Entity[]> {
    return this.entityRepository.find({
      where: { status: query.status },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
  }

  async create(createDto: CreateDto): Promise<Entity> {
    const entity = this.entityRepository.create(createDto);
    return this.entityRepository.save(entity);
  }
}
```

### Git 工作流程

#### 分支策略
```
main/master     → 生產環境（受保護）
  ↓
develop         → 開發環境（受保護，主要開發分支）
  ↓
feature/*       → 功能開發（從 develop 分支）
hotfix/*        → 緊急修復（從 main 分支）
release/*       → 版本發布（從 develop 分支）
```

#### 分支命名
```bash
feature/add-user-authentication
feature/issue-123-implement-payment
fix/user-login-error
hotfix/critical-security-patch
release/v1.2.0
```

### Commit 訊息規範（Conventional Commits）

#### 格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 類型
- **feat**: 新功能
- **fix**: Bug 修復
- **docs**: 文檔更新
- **style**: 程式碼格式（不影響功能）
- **refactor**: 重構
- **perf**: 效能優化
- **test**: 測試相關
- **chore**: 建置、依賴、工具更新

#### 範例
```bash
feat(auth): 新增 Google OAuth 登入功能

實作 Google OAuth 2.0 第三方登入整合
- 新增 Google Strategy
- 更新前端登入按鈕
- 新增相關環境變數設定

Closes #123
```

```bash
fix(user): 修復使用者頭像上傳失敗問題

修正 S3 bucket 權限設定導致的上傳錯誤
```

```bash
docs: 更新 README 部署指南
```

### Pull Request 規範

#### PR 標題
與 commit 訊息格式相同：`<type>(<scope>): <description>`

#### PR 描述模板
```markdown
## 變更說明
[簡述本次 PR 的主要變更]

## 變更類型
- [ ] 新功能
- [ ] Bug 修復
- [ ] 重構
- [ ] 文檔更新
- [ ] 其他

## 測試
- [ ] 已通過單元測試
- [ ] 已通過 E2E 測試
- [ ] 已手動測試

## 相關 Issue
Closes #[issue_number]

## 截圖（UI 變更時）
[如有 UI 變更，附上截圖]

## Breaking Changes
[如有破壞性變更，說明影響範圍與遷移方式]

## Checklist
- [ ] 程式碼符合專案規範
- [ ] 已更新相關文檔
- [ ] 已測試所有變更
- [ ] 無新增的 console.log 或 TODO
```

#### 審查要求
- 至少 1 人審查（建議 2 人）
- CI/CD 測試全部通過
- 無未解決的對話
- 程式碼符合規範

---

## 🧪 測試策略

### 測試配置

#### Jest 設定
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
```

### 測試類型

#### 單元測試（Unit Tests）
- **目標**: 測試個別函數、方法的邏輯
- **範圍**: Services、Utils、Helpers
- **覆蓋率目標**: 80% 以上

**範例：Service 測試**
```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', name: 'Test' }];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      expect(await service.findAll()).toBe(users);
    });
  });
});
```

#### 整合測試（Integration Tests）
- **目標**: 測試多個元件之間的互動
- **範圍**: Controller + Service + Repository
- **Mock**: 外部服務（郵件、S3）

#### E2E 測試（End-to-End Tests）
- **目標**: 測試完整的使用者流程
- **範圍**: API 端點、資料庫互動
- **工具**: Supertest

**範例：E2E 測試**
```typescript
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### 測試執行

```bash
# 單元測試
npm run test

# E2E 測試
npm run test:e2e

# 測試覆蓋率
npm run test:cov

# Watch 模式
npm run test:watch

# Debug 模式
npm run test:debug
```

### 測試最佳實踐

- ✅ **AAA 模式**: Arrange（準備）、Act（執行）、Assert（斷言）
- ✅ **獨立性**: 每個測試應獨立運行，不依賴其他測試
- ✅ **清晰命名**: 測試名稱應清楚描述測試內容
- ✅ **Mock 外部依賴**: 隔離外部服務
- ✅ **測試邊界情況**: 包含正常、異常、邊界值
- ✅ **快速執行**: 單元測試應在秒級完成

---

## 🌍 環境配置

### 環境變數管理

使用 `.env` 檔案管理環境變數，**不提交到版控**。

#### .env 範例
```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=/api

# URLs
ADMIN_DASHBOARD_URL=http://localhost:3001
WEB_URL=http://localhost:3000
FILE_URL=https://your-cdn.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=your_database

# JWT
ADMIN_JWT_SECRET=your_admin_secret_key_here
JWT_EXPIRES_IN=1d
WEB_JWT_SECRET=your_web_secret_key_here
WEB_JWT_EXPIRES_IN=7d
WEB_RESET_PASSWORD_EXPIRES_IN=1h

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# OAuth - Facebook
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback

# OAuth - LINE
LINE_CHANNEL_ID=your_line_channel_id
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_CALLBACK_URL=http://localhost:3000/api/auth/line/callback

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_ENDPOINT=https://s3.amazonaws.com
STORAGE_PROVIDER=s3

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME=Your App Name

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting (optional)
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### 環境變數驗證

使用 Joi 驗證環境變數：

```typescript
// src/config/validation.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  
  // ... 其他驗證規則
});
```

### 環境區分

- **development**: 本地開發環境
  - 詳細日誌輸出
  - 開放 CORS
  - 使用本地資料庫
  
- **staging**: 測試環境
  - 模擬生產環境
  - 有限的 CORS
  - 使用測試資料庫

- **production**: 生產環境
  - 最小化日誌
  - 嚴格的 CORS
  - 生產資料庫
  - HTTPS 強制

---

## 🚀 本地開發指南

### 前置需求

- **Node.js**: v18+ 或 v20+
- **npm**: v9+ 或 **yarn**: v1.22+
- **MySQL**: v8.0
- **Docker** (可選): 用於運行資料庫容器

### 安裝步驟

#### 1. 複製專案
```bash
git clone [repository-url]
cd [project-name]
```

#### 2. 安裝依賴
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

#### 3. 設定環境變數
```bash
# 複製環境變數範本
cp .env.example .env

# 編輯 .env 填入必要設定
# 至少需要設定：
# - 資料庫連線資訊
# - JWT Secret
# - 其他必要的 API Keys
```

#### 4. 啟動資料庫

**選項 A: 使用 Docker**
```bash
# 啟動 MySQL 容器
docker-compose up -d

# 或使用 Makefile
make d-up

# 檢查容器狀態
docker-compose ps
```

**選項 B: 本地 MySQL**
```bash
# 確保 MySQL 服務已啟動
# 建立資料庫
mysql -u root -p
CREATE DATABASE your_database;
```

#### 5. 執行資料庫遷移
```bash
# TypeORM 自動同步（開發環境）
# synchronize: true 會自動建立表格

# 如需執行遷移
npm run migration:run
```

#### 6. 載入種子資料（可選）
```bash
npm run seed
```

#### 7. 啟動開發伺服器
```bash
npm run start:dev
```

應用程式將在 `http://localhost:3000` 啟動。
Swagger 文檔將在 `http://localhost:3000/api` 可用。

### 常用開發指令

```bash
# 開發模式（watch mode）
npm run start:dev

# 一般啟動
npm run start

# Debug 模式
npm run start:debug

# 生產模式
npm run build
npm run start:prod

# 程式碼檢查
npm run lint

# 程式碼格式化
npm run format

# 測試
npm run test           # 單元測試
npm run test:watch     # Watch 模式
npm run test:e2e       # E2E 測試
npm run test:cov       # 測試覆蓋率

# 資料庫相關
npm run seed           # 執行種子資料

# Docker 相關（需要 Makefile）
make d-up              # 啟動資料庫容器
make d-down            # 停止容器
make d-re-up           # 重啟容器
```

### 開發環境驗證

#### 1. 檢查 API 健康狀態
```bash
curl http://localhost:3000/api
```

#### 2. 訪問 Swagger 文檔
打開瀏覽器訪問：`http://localhost:3000/api`

#### 3. 測試資料庫連線
```bash
# 查看應用程式日誌
# 應該看到 "Database connected" 相關訊息
```

### 常見開發問題

#### 資料庫連線失敗
```bash
# 檢查 MySQL 是否啟動
docker-compose ps
# 或
systemctl status mysql

# 檢查環境變數設定
cat .env | grep DB_

# 測試資料庫連線
mysql -h localhost -u your_username -p your_database
```

#### Port 已被佔用
```bash
# 修改 .env 中的 PORT
PORT=3001

# 或找出佔用 Port 的程序
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

#### 依賴安裝失敗
```bash
# 清除快取重新安裝
rm -rf node_modules
rm package-lock.json
npm install

# 或使用 yarn
rm -rf node_modules
rm yarn.lock
yarn install
```

---

## 🐳 Docker 部署

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# 複製 package files
COPY package*.json ./
COPY yarn.lock ./

# 安裝依賴
RUN yarn install --frozen-lockfile

# 複製原始碼
COPY . .

# 建置應用程式
RUN yarn build

# Production stage
FROM node:18-alpine

WORKDIR /app

# 複製必要檔案
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# 設定環境變數
ENV NODE_ENV=production

# 暴露 port
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 啟動應用程式
CMD ["node", "dist/main"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: app_api
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE: ${DB_DATABASE}
    depends_on:
      - mysql
    restart: unless-stopped
    networks:
      - app-network

  mysql:
    image: mysql:8.0
    container_name: mysql_db
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_DATABASE}
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - '3306:3306'
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mysql_data:
```

### Docker 指令

```bash
# 建置映像檔
docker build -t app-name:latest .

# 啟動服務
docker-compose up -d

# 查看日誌
docker-compose logs -f app

# 停止服務
docker-compose down

# 重建並啟動
docker-compose up -d --build

# 清理（包含 volumes）
docker-compose down -v
```

---

## 🔄 CI/CD 流程

### GitHub Actions 範例

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: test_db
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Run tests
        run: npm run test
        env:
          DB_HOST: localhost
          DB_PORT: 3306
          DB_USERNAME: root
          DB_PASSWORD: root
          DB_DATABASE: test_db

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to production
        run: |
          echo "Deploy to production server"
          # 實際部署指令
```

### GitLab CI 範例

```yaml
stages:
  - test
  - build
  - deploy

variables:
  MYSQL_ROOT_PASSWORD: root
  MYSQL_DATABASE: test_db

test:
  stage: test
  image: node:18
  services:
    - mysql:8.0
  before_script:
    - npm ci
  script:
    - npm run lint
    - npm run test
    - npm run test:e2e
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
  only:
    - main
    - develop

deploy_production:
  stage: deploy
  script:
    - echo "Deploy to production"
    # 實際部署指令
  only:
    - main
  when: manual
```

---

## 📊 監控與日誌

### 日誌管理

#### Logger Middleware
```typescript
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent}`
      );
    });

    next();
  }
}
```

### 日誌等級
- **log**: 一般資訊
- **error**: 錯誤訊息
- **warn**: 警告訊息
- **debug**: 除錯資訊（僅開發環境）
- **verbose**: 詳細資訊

### 效能監控建議

- **APM 工具**: New Relic, Datadog, Sentry
- **健康檢查端點**: `/api/health`
- **資料庫查詢監控**: 記錄慢查詢
- **記憶體使用**: 監控記憶體洩漏
- **API 回應時間**: 追蹤端點效能

---

## 📚 附錄

### 專案依賴清單

詳見 `package.json` 中的：
- `dependencies`: 生產環境依賴
- `devDependencies`: 開發環境依賴

### 相關資源

#### 官方文檔
- [NestJS 官方文檔](https://docs.nestjs.com/)
- [TypeORM 官方文檔](https://typeorm.io/)
- [TypeScript 官方文檔](https://www.typescriptlang.org/docs/)
- [Jest 官方文檔](https://jestjs.io/docs/getting-started)

#### 技術文章
- [NestJS 最佳實踐](https://docs.nestjs.com/techniques/configuration)
- [TypeORM 進階用法](https://typeorm.io/relations)
- [JWT 最佳實踐](https://jwt.io/introduction)

### 專案聯絡資訊

- **技術負責人**: [姓名] - [Email]
- **專案經理**: [姓名] - [Email]
- **Git Repository**: [Repository URL]
- **問題回報**: [Issue Tracker URL]

---

**最後更新**: 2025-10-31  
**文檔版本**: 1.0.0
