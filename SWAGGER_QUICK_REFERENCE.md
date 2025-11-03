# Swagger Examples 快速參考指南

## 🚀 快速開始

### 啟動並查看 Swagger 文檔
```bash
cd backend
npm run start:dev
# 訪問: http://localhost:3000/api
```

---

## 📋 所有已完成的範例補充

### ✅ 認證 (Auth) - 8 個端點
| 端點 | 方法 | 說明 | 範例 |
|------|------|------|------|
| `/auth/register` | POST | 使用者註冊 | ✅ 完整 |
| `/auth/login` | POST | 使用者登入 | ✅ 完整 |
| `/auth/logout` | POST | 使用者登出 | ✅ 完整 |
| `/auth/refresh` | POST | 刷新令牌 | ✅ 完整 |
| `/auth/me` | GET | 當前使用者 | ✅ 完整 |
| `/auth/forgot-password` | POST | 忘記密碼 | ✅ 完整 |
| `/auth/reset-password` | POST | 重設密碼 | ✅ 完整 |
| `/auth/change-password` | POST | 變更密碼 | ✅ 完整 |

### ✅ 測驗 (Exams) - 3 個端點
| 端點 | 方法 | 說明 | 範例 |
|------|------|------|------|
| `/exams/start` | POST | 開始新測驗 | ✅ 完整 |
| `/exams/:id` | GET | 取得測驗資訊 | ✅ 完整 |
| `/exams/:id/current` | GET | 取得當前題目 | ✅ 完整 |

### ✅ 答案 (Answers) - 3 個端點
| 端點 | 方法 | 說明 | 範例 |
|------|------|------|------|
| `/answers/submit` | POST | 提交答案 | ✅ 完整 |
| `/answers/exam/:examId` | GET | 取得測驗答案 | ✅ 完整 |
| `/answers/:id` | GET | 取得答案記錄 | ✅ 完整 |

### ✅ 群組測驗 (Groups) - 3 個端點
| 端點 | 方法 | 說明 | 範例 |
|------|------|------|------|
| `/groups/batches` | POST | 建立批次 | ✅ 完整 |
| `/groups/batches/:id/configure` | POST | 設定受測者 | ✅ 完整 |
| `/groups/batches/:id` | GET | 取得批次狀態 | ✅ 完整 |

### ✅ 群組測驗受測者 (Group Exams) - 3 個端點
| 端點 | 方法 | 說明 | 範例 |
|------|------|------|------|
| `/group-exams/:batchToken/start` | GET | 開始群組測驗 | ✅ 完整 |
| `/group-exams/:examId/submit-answer` | POST | 提交答案 | ✅ 完整 |
| `/group-exams/:examId/complete` | POST | 完成測驗 | ✅ 完整 |

### ✅ OTP 驗證 (OTP) - 2 個端點
| 端點 | 方法 | 說明 | 範例 |
|------|------|------|------|
| `/otp/send` | POST | 發送 OTP | ✅ 完整 |
| `/otp/verify` | POST | 驗證 OTP | ✅ 完整 |

### ✅ 付款 (Payments) - 4 個端點
| 端點 | 方法 | 說明 | 範例 |
|------|------|------|------|
| `/payments/create-checkout` | POST | 建立結帳 | ✅ 完整 |
| `/payments/webhook` | POST | Stripe Webhook | ✅ 完整 |
| `/payments/:paymentId` | GET | 查詢付款狀態 | ✅ 完整 |
| `/payments/user/history` | GET | 付款歷史 | ✅ 完整 |

### ✅ 報表 (Reports) - 6 個端點
| 端點 | 方法 | 說明 | 範例 |
|------|------|------|------|
| `/reports/exam/:examId` | POST | 生成報表 | ✅ 完整 |
| `/reports/:id` | GET | 取得報表 | ✅ 完整 |
| `/reports/exam/:examId` | GET | 取得測驗報表 | ✅ 完整 |
| `/reports/:id/pdf` | GET | 下載 PDF | ✅ 完整 |
| `/reports/:id/recommendations` | GET | 推薦講座 | ✅ 完整 |
| `/reports/:id/answer-distribution/:questionId` | GET | 答案分佈 | ✅ 完整 |

### ✅ 使用者 (Users) - 3 個端點
| 端點 | 方法 | 說明 | 範例 |
|------|------|------|------|
| `/users/profile` | GET | 取得個人資料 | ✅ 完整 |
| `/users/profile` | PUT | 更新個人資料 | ✅ 完整 |
| `/users/:id` | GET | 取得使用者 | ✅ 完整 |

### ✅ 題目 (Questions) - 3 個端點
| 端點 | 方法 | 說明 | 範例 |
|------|------|------|------|
| `/questions` | GET | 取得所有題目 | ✅ 完整 |
| `/questions/:id` | GET | 取得單一題目 | ✅ 完整 |
| `/questions/type/:examType` | GET | 依類型取得 | ✅ 完整 |

---

## 📊 總覽

| 模組 | 端點數 | 狀態 |
|------|--------|------|
| Auth | 8 | ✅ |
| Exams | 3 | ✅ |
| Answers | 3 | ✅ |
| Groups | 3 | ✅ |
| Group Exams | 3 | ✅ |
| OTP | 2 | ✅ |
| Payments | 4 | ✅ |
| Reports | 6 | ✅ |
| Users | 3 | ✅ |
| Questions | 3 | ✅ |
| **總計** | **38** | **✅ 100%** |

---

## 🎯 範例格式

### DTO 範例
```typescript
export class LoginDto {
  @ApiProperty({ 
    description: '使用者 Email',
    example: 'user@example.com'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ 
    description: '密碼',
    example: 'Password123',
    minLength: 8,
    maxLength: 50
  })
  @IsString()
  password!: string;
}
```

### Controller 範例
```typescript
@Post('login')
@ApiOperation({ 
  summary: '使用者登入',
  description: '使用 Email 和密碼進行身份驗證'
})
@ApiBody({ type: LoginDto })
@ApiResponse({ 
  status: 200, 
  description: '登入成功', 
  type: AuthResponseDto,
  example: {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    email: 'user@example.com',
    name: '王小明'
  }
})
@ApiResponse({ status: 401, description: '帳號或密碼錯誤' })
async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
  return this.authService.login(loginDto);
}
```

---

## 🔍 常用範例值

### UUID / ID
```typescript
'550e8400-e29b-41d4-a716-446655440000'
'123e4567-e89b-12d3-a456-426614174000'
```

### Email
```typescript
'user@example.com'
'admin@example.com'
```

### 密碼
```typescript
'Password123'  // 符合規則：大小寫+數字
```

### 日期時間
```typescript
'2024-01-15T10:00:00Z'
'2024-01-15T10:00:00.000Z'
```

### 測驗類型
```typescript
'peripheral_blood'
'bone_marrow'
'body_fluid'
```

### 測驗版本
```typescript
'free'
'personal'
'group'
```

### 測驗狀態
```typescript
'in_progress'
'completed'
'expired'
```

### 細胞類型
```typescript
'neutrophil'      // 嗜中性球
'lymphocyte'      // 淋巴球
'monocyte'        // 單核球
'eosinophil'      // 嗜酸性球
'basophil'        // 嗜鹼性球
```

---

## 🛠️ 開發建議

### 新增 API 時的檢查清單
- [ ] DTO 添加 `@ApiProperty` 和 example
- [ ] Controller 添加 `@ApiOperation`
- [ ] Controller 添加 `@ApiResponse` (200/201)
- [ ] Controller 添加錯誤 `@ApiResponse` (400/401/404)
- [ ] 需要認證的添加 `@ApiBearerAuth()`
- [ ] 測試 Swagger UI 顯示
- [ ] 測試範例資料是否正確

### 命名規範
- **DTO**: `xxxDto` (例如: `LoginDto`)
- **Response DTO**: `xxxResponseDto` (例如: `AuthResponseDto`)
- **Entity**: 單數名詞 (例如: `User`, `Question`)
- **Controller**: `xxxController` (例如: `AuthController`)

---

## 📖 更多資訊

詳細文檔請參考: [SWAGGER_EXAMPLES_COMPLETE.md](./SWAGGER_EXAMPLES_COMPLETE.md)

---

**更新日期**: 2024-01-15  
**完成度**: 100% ✅  
**建置狀態**: 成功 ✅
