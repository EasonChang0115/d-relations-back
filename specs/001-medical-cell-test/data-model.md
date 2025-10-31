# 資料模型：醫學細胞識別能力測驗平台

**分支**: `001-medical-cell-test` | **日期**: 2025-10-31 | **階段**: Phase 1 - Data Model Design

## 概述

本文件定義醫學細胞識別能力測驗平台的資料庫架構，包含所有核心實體、屬性、關聯及索引策略。資料庫採用 MySQL 8.0，透過 TypeORM 0.3.25 進行 ORM 映射。

---

## 實體關係圖（ERD）概述

```
User (使用者)
  ├─→ 1:N → Exam (測驗)
  ├─→ 1:N → OTPVerification (OTP 驗證記錄)
  ├─→ 1:N → Session (會話)
  └─→ 1:N → PaymentRecord (付款記錄)

Exam (測驗)
  ├─→ N:1 → User (使用者)
  ├─→ N:1 → GroupExamBatch (團體測驗批次, 可為空)
  ├─→ 1:N → AnswerRecord (答案記錄)
  └─→ 1:1 → ResultReport (結果報表)

Question (題目)
  ├─→ 1:N → CellImage (細胞圖片)
  └─→ 1:N → AnswerRecord (答案記錄)

GroupExamBatch (團體測驗批次)
  ├─→ N:1 → User (管理者)
  └─→ 1:N → Exam (測驗)

AnswerRecord (答案記錄)
  ├─→ N:1 → Exam (測驗)
  ├─→ N:1 → Question (題目)
  └─→ N:1 → CellImage (使用的圖片)

ResultReport (結果報表)
  └─→ 1:1 → Exam (測驗)

PaymentRecord (付款記錄)
  ├─→ N:1 → User (使用者)
  └─→ 1:1 → Exam (測驗, 個人) 或 1:1 → GroupExamBatch (團體)
```

---

## 核心實體定義

### 1. User (使用者)

**用途**: 儲存系統使用者的基本資訊，包含個人測驗者、團體管理者及團體受測者。

**TypeORM Entity**:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Exam } from "./exam.entity";
import { OTPVerification } from "./otp-verification.entity";
import { Session } from "./session.entity";
import { PaymentRecord } from "./payment-record.entity";
import { GroupExamBatch } from "./group-exam-batch.entity";

export enum UserRole {
  FREE_USER = "free_user", // 免費版使用者
  PAID_USER = "paid_user", // 付費版使用者
  GROUP_ADMIN = "group_admin", // 團體管理者
  GROUP_TAKER = "group_taker", // 團體受測者
}

export enum CertificationStatus {
  CERTIFIED = "certified", // 已取得證照
  NOT_CERTIFIED = "not_certified", // 未取得證照
  IN_PROGRESS = "in_progress", // 正在考取中
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.FREE_USER })
  role: UserRole;

  @Column({ length: 50, nullable: true })
  organization_code: string;

  @Column({ length: 100, nullable: true })
  job_title: string;

  @Column({
    type: "enum",
    enum: CertificationStatus,
    nullable: true,
  })
  certification_status: CertificationStatus;

  @Column({ type: "text", nullable: true })
  additional_info: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 關聯
  @OneToMany(() => Exam, (exam) => exam.user)
  exams: Exam[];

  @OneToMany(() => OTPVerification, (otp) => otp.user)
  otp_verifications: OTPVerification[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => PaymentRecord, (payment) => payment.user)
  payments: PaymentRecord[];

  @OneToMany(() => GroupExamBatch, (batch) => batch.admin)
  managed_batches: GroupExamBatch[];
}
```

**資料庫表格** (`users`):
| 欄位 | 型別 | 約束 | 說明 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID 主鍵 |
| name | VARCHAR(100) | NOT NULL | 使用者姓名 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 電子郵件 |
| role | ENUM | NOT NULL | 使用者角色 |
| organization_code | VARCHAR(50) | NULL | 組織代碼 |
| job_title | VARCHAR(100) | NULL | 職種 |
| certification_status | ENUM | NULL | 證照狀態 |
| additional_info | TEXT | NULL | 其他資訊 |
| is_active | BOOLEAN | DEFAULT TRUE | 帳號啟用狀態 |
| created_at | TIMESTAMP | NOT NULL | 建立時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引**:

- PRIMARY KEY (`id`)
- UNIQUE INDEX `idx_email` (`email`)
- INDEX `idx_role` (`role`)
- INDEX `idx_created_at` (`created_at`)

**驗證規則**:

- `email`: 必須符合 RFC 5322 格式
- `name`: 長度 2-100 字元
- `organization_code`: 長度 1-50 字元（如提供）

---

### 2. Exam (測驗)

**用途**: 儲存測驗實例，包含測驗類型、版本、題目、答題狀態等資訊。

**TypeORM Entity**:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { GroupExamBatch } from "./group-exam-batch.entity";
import { AnswerRecord } from "./answer-record.entity";
import { ResultReport } from "./result-report.entity";

export enum ExamType {
  PERIPHERAL_BLOOD = "peripheral_blood", // 末梢血版
  BONE_MARROW = "bone_marrow", // 骨髓版
}

export enum ExamVersion {
  FREE = "free", // 免費版 (15 題)
  PAID_INDIVIDUAL = "paid_individual", // 付費版個人 (20 題)
  PAID_GROUP = "paid_group", // 付費版團體 (20 題)
}

export enum ExamStatus {
  PENDING = "pending", // 待開始（已購買未驗證）
  VERIFIED = "verified", // 已驗證（可開始）
  IN_PROGRESS = "in_progress", // 進行中
  COMPLETED = "completed", // 已完成
  EXPIRED = "expired", // 已過期
}

@Entity("exams")
export class Exam {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: ExamType })
  exam_type: ExamType;

  @Column({ type: "enum", enum: ExamVersion })
  version: ExamVersion;

  @Column({ type: "enum", enum: ExamStatus, default: ExamStatus.PENDING })
  status: ExamStatus;

  @Column({ type: "json" })
  question_sequence: {
    question_id: string;
    image_id: string;
    order: number;
  }[];

  @Column({ type: "int", default: 0 })
  current_question_index: number;

  @Column({ type: "timestamp", nullable: true })
  started_at: Date;

  @Column({ type: "timestamp", nullable: true })
  completed_at: Date;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @Column({ type: "varchar", length: 36, nullable: true })
  access_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 關聯
  @ManyToOne(() => User, (user) => user.exams)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 36 })
  user_id: string;

  @ManyToOne(() => GroupExamBatch, (batch) => batch.exams, { nullable: true })
  @JoinColumn({ name: "batch_id" })
  batch: GroupExamBatch;

  @Column({ type: "varchar", length: 36, nullable: true })
  batch_id: string;

  @OneToMany(() => AnswerRecord, (answer) => answer.exam)
  answers: AnswerRecord[];

  @OneToOne(() => ResultReport, (report) => report.exam)
  report: ResultReport;
}
```

**資料庫表格** (`exams`):
| 欄位 | 型別 | 約束 | 說明 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID 主鍵 |
| user_id | VARCHAR(36) | FK, NOT NULL | 使用者 ID |
| batch_id | VARCHAR(36) | FK, NULL | 團體批次 ID（團體測驗用） |
| exam_type | ENUM | NOT NULL | 測驗類型 |
| version | ENUM | NOT NULL | 測驗版本 |
| status | ENUM | DEFAULT 'pending' | 測驗狀態 |
| question_sequence | JSON | NOT NULL | 題目順序與圖片組合 |
| current_question_index | INT | DEFAULT 0 | 當前題號 |
| started_at | TIMESTAMP | NULL | 開始時間 |
| completed_at | TIMESTAMP | NULL | 完成時間 |
| expires_at | TIMESTAMP | NOT NULL | 過期時間 |
| access_token | VARCHAR(36) | NULL | 測驗連結 Token |
| created_at | TIMESTAMP | NOT NULL | 建立時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引**:

- PRIMARY KEY (`id`)
- FOREIGN KEY (`user_id`) REFERENCES `users(id)`
- FOREIGN KEY (`batch_id`) REFERENCES `group_exam_batches(id)`
- INDEX `idx_user_id` (`user_id`)
- INDEX `idx_batch_id` (`batch_id`)
- INDEX `idx_status` (`status`)
- INDEX `idx_expires_at` (`expires_at`)
- UNIQUE INDEX `idx_access_token` (`access_token`)

**business_logic**:

- `question_sequence`: 儲存格式 `[{question_id, image_id, order}]`
- `access_token`: 用於測驗連結的唯一識別碼
- `expires_at`: 免費版 7 天，付費版 10 天（受測者）

---

### 3. Question (題目)

**用途**: 儲存測驗題目，包含細胞類型、正確答案等資訊。

**TypeORM Entity**:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { CellImage } from "./cell-image.entity";
import { AnswerRecord } from "./answer-record.entity";

export enum CellType {
  // 末梢血版細胞類型
  NEUTROPHIL = "neutrophil", // 嗜中性球
  LYMPHOCYTE = "lymphocyte", // 淋巴球
  MONOCYTE = "monocyte", // 單核球
  EOSINOPHIL = "eosinophil", // 嗜酸性球
  BASOPHIL = "basophil", // 嗜鹼性球
  // ... 其他末梢血細胞類型

  // 骨髓版細胞類型
  MYELOBLAST = "myeloblast", // 骨髓母細胞
  PROMYELOCYTE = "promyelocyte", // 前骨髓細胞
  MYELOCYTE = "myelocyte", // 骨髓細胞
  // ... 其他骨髓細胞類型
}

export enum DifficultyLevel {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: CellType })
  cell_type: CellType;

  @Column({ length: 100 })
  correct_answer: string;

  @Column({ type: "enum", enum: ExamType })
  exam_type: ExamType;

  @Column({
    type: "enum",
    enum: DifficultyLevel,
    default: DifficultyLevel.MEDIUM,
  })
  difficulty: DifficultyLevel;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 關聯
  @OneToMany(() => CellImage, (image) => image.question)
  images: CellImage[];

  @OneToMany(() => AnswerRecord, (answer) => answer.question)
  answer_records: AnswerRecord[];
}
```

**資料庫表格** (`questions`):
| 欄位 | 型別 | 約束 | 說明 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID 主鍵 |
| cell_type | ENUM | NOT NULL | 細胞類型 |
| correct_answer | VARCHAR(100) | NOT NULL | 正確答案 |
| exam_type | ENUM | NOT NULL | 所屬測驗類型 |
| difficulty | ENUM | DEFAULT 'medium' | 難度 |
| description | TEXT | NULL | 題目說明 |
| is_active | BOOLEAN | DEFAULT TRUE | 啟用狀態 |
| created_at | TIMESTAMP | NOT NULL | 建立時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引**:

- PRIMARY KEY (`id`)
- INDEX `idx_cell_type` (`cell_type`)
- INDEX `idx_exam_type` (`exam_type`)
- INDEX `idx_is_active` (`is_active`)

---

### 4. CellImage (細胞圖片)

**用途**: 儲存細胞圖片資訊，每個題目（細胞類型）對應 10 張圖片。

**TypeORM Entity**:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Question } from "./question.entity";

@Entity("cell_images")
export class CellImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 500 })
  image_url: string;

  @Column({ length: 500, nullable: true })
  thumbnail_url: string;

  @Column({ length: 100, nullable: true })
  filename: string;

  @Column({ type: "int", nullable: true })
  file_size: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 關聯
  @ManyToOne(() => Question, (question) => question.images)
  @JoinColumn({ name: "question_id" })
  question: Question;

  @Column({ type: "varchar", length: 36 })
  question_id: string;
}
```

**資料庫表格** (`cell_images`):
| 欄位 | 型別 | 約束 | 說明 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID 主鍵 |
| question_id | VARCHAR(36) | FK, NOT NULL | 題目 ID |
| image_url | VARCHAR(500) | NOT NULL | S3 完整 URL |
| thumbnail_url | VARCHAR(500) | NULL | 縮圖 URL |
| filename | VARCHAR(100) | NULL | 檔案名稱 |
| file_size | INT | NULL | 檔案大小（bytes） |
| is_active | BOOLEAN | DEFAULT TRUE | 啟用狀態 |
| created_at | TIMESTAMP | NOT NULL | 建立時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引**:

- PRIMARY KEY (`id`)
- FOREIGN KEY (`question_id`) REFERENCES `questions(id)`
- INDEX `idx_question_id` (`question_id`)
- INDEX `idx_is_active` (`is_active`)

**驗證規則**:

- 每個 Question 必須有恰好 10 張 CellImage（在應用層驗證）
- `image_url`: AWS S3 URL 格式

---

### 5. AnswerRecord (答案記錄)

**用途**: 儲存使用者對每題的答案記錄。

**TypeORM Entity**:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Exam } from "./exam.entity";
import { Question } from "./question.entity";
import { CellImage } from "./cell-image.entity";

@Entity("answer_records")
export class AnswerRecord {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  question_order: number;

  @Column({ length: 100 })
  user_answer: string;

  @Column({ type: "boolean" })
  is_correct: boolean;

  @Column({ type: "boolean", default: false })
  is_skipped: boolean;

  @CreateDateColumn()
  answered_at: Date;

  // 關聯
  @ManyToOne(() => Exam, (exam) => exam.answers)
  @JoinColumn({ name: "exam_id" })
  exam: Exam;

  @Column({ type: "varchar", length: 36 })
  exam_id: string;

  @ManyToOne(() => Question, (question) => question.answer_records)
  @JoinColumn({ name: "question_id" })
  question: Question;

  @Column({ type: "varchar", length: 36 })
  question_id: string;

  @ManyToOne(() => CellImage)
  @JoinColumn({ name: "image_id" })
  image: CellImage;

  @Column({ type: "varchar", length: 36 })
  image_id: string;
}
```

**資料庫表格** (`answer_records`):
| 欄位 | 型別 | 約束 | 說明 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID 主鍵 |
| exam_id | VARCHAR(36) | FK, NOT NULL | 測驗 ID |
| question_id | VARCHAR(36) | FK, NOT NULL | 題目 ID |
| image_id | VARCHAR(36) | FK, NOT NULL | 使用的圖片 ID |
| question_order | INT | NOT NULL | 題號 (1-based) |
| user_answer | VARCHAR(100) | NOT NULL | 使用者答案 |
| is_correct | BOOLEAN | NOT NULL | 是否正確 |
| is_skipped | BOOLEAN | DEFAULT FALSE | 是否跳過 |
| answered_at | TIMESTAMP | NOT NULL | 作答時間 |

**索引**:

- PRIMARY KEY (`id`)
- FOREIGN KEY (`exam_id`) REFERENCES `exams(id)`
- FOREIGN KEY (`question_id`) REFERENCES `questions(id)`
- FOREIGN KEY (`image_id`) REFERENCES `cell_images(id)`
- INDEX `idx_exam_id` (`exam_id`)
- INDEX `idx_question_image` (`question_id`, `image_id`)
- UNIQUE INDEX `idx_exam_order` (`exam_id`, `question_order`)

---

### 6. ResultReport (結果報表)

**用途**: 儲存測驗完成後的結果報表資訊。

**TypeORM Entity**:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Exam } from "./exam.entity";

@Entity("result_reports")
export class ResultReport {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  accuracy_rate: number;

  @Column({ type: "int" })
  total_questions: number;

  @Column({ type: "int" })
  correct_count: number;

  @Column({ type: "int" })
  incorrect_count: number;

  @Column({ type: "int", default: 0 })
  skipped_count: number;

  @Column({ type: "json", nullable: true })
  statistics: {
    question_id: string;
    image_id: string;
    answer_distribution: {
      answer: string;
      count: number;
      percentage: number;
    }[];
  }[];

  @Column({ type: "text", nullable: true })
  recommended_courses: string;

  @Column({ length: 500, nullable: true })
  pdf_url: string;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 關聯
  @OneToOne(() => Exam, (exam) => exam.report)
  @JoinColumn({ name: "exam_id" })
  exam: Exam;

  @Column({ type: "varchar", length: 36 })
  exam_id: string;
}
```

**資料庫表格** (`result_reports`):
| 欄位 | 型別 | 約束 | 說明 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID 主鍵 |
| exam_id | VARCHAR(36) | FK, UNIQUE, NOT NULL | 測驗 ID |
| accuracy_rate | DECIMAL(5,2) | NOT NULL | 正答率（%） |
| total_questions | INT | NOT NULL | 總題數 |
| correct_count | INT | NOT NULL | 正確數 |
| incorrect_count | INT | NOT NULL | 錯誤數 |
| skipped_count | INT | DEFAULT 0 | 跳過數 |
| statistics | JSON | NULL | 統計資訊（付費版） |
| recommended_courses | TEXT | NULL | 推薦講座（付費版） |
| pdf_url | VARCHAR(500) | NULL | PDF 報表 S3 URL |
| expires_at | TIMESTAMP | NOT NULL | 報表過期時間 |
| created_at | TIMESTAMP | NOT NULL | 建立時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引**:

- PRIMARY KEY (`id`)
- FOREIGN KEY (`exam_id`) REFERENCES `exams(id)`
- UNIQUE INDEX `idx_exam_id` (`exam_id`)
- INDEX `idx_expires_at` (`expires_at`)

---

### 7. GroupExamBatch (團體測驗批次)

**用途**: 儲存團體測驗的批次資訊，包含管理者、受測者清單、題目組合等。

**TypeORM Entity**:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Exam } from "./exam.entity";

export enum BatchStatus {
  PENDING = "pending", // 待設定
  CONFIGURED = "configured", // 已設定（已發送測驗連結）
  IN_PROGRESS = "in_progress", // 進行中
  COMPLETED = "completed", // 已完成
  EXPIRED = "expired", // 已過期
}

@Entity("group_exam_batches")
export class GroupExamBatch {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: ExamType })
  exam_type: ExamType;

  @Column({ type: "int" })
  purchased_quantity: number;

  @Column({ type: "enum", enum: BatchStatus, default: BatchStatus.PENDING })
  status: BatchStatus;

  @Column({ type: "json" })
  question_sequence: {
    question_id: string;
    image_id: string;
    order: number;
  }[];

  @Column({ type: "varchar", length: 36 })
  admin_access_token: string;

  @Column({ type: "timestamp", nullable: true })
  configured_at: Date;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 關聯
  @ManyToOne(() => User, (user) => user.managed_batches)
  @JoinColumn({ name: "admin_id" })
  admin: User;

  @Column({ type: "varchar", length: 36 })
  admin_id: string;

  @OneToMany(() => Exam, (exam) => exam.batch)
  exams: Exam[];
}
```

**資料庫表格** (`group_exam_batches`):
| 欄位 | 型別 | 約束 | 說明 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID 主鍵 |
| admin_id | VARCHAR(36) | FK, NOT NULL | 管理者 ID |
| exam_type | ENUM | NOT NULL | 測驗類型 |
| purchased_quantity | INT | NOT NULL | 購買人數 |
| status | ENUM | DEFAULT 'pending' | 批次狀態 |
| question_sequence | JSON | NOT NULL | 題目順序（所有受測者共用） |
| admin_access_token | VARCHAR(36) | UNIQUE, NOT NULL | 管理頁面 Token |
| configured_at | TIMESTAMP | NULL | 設定完成時間 |
| expires_at | TIMESTAMP | NOT NULL | 管理頁面過期時間（1 個月） |
| created_at | TIMESTAMP | NOT NULL | 建立時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引**:

- PRIMARY KEY (`id`)
- FOREIGN KEY (`admin_id`) REFERENCES `users(id)`
- INDEX `idx_admin_id` (`admin_id`)
- UNIQUE INDEX `idx_admin_token` (`admin_access_token`)
- INDEX `idx_expires_at` (`expires_at`)

---

### 8. OTPVerification (OTP 驗證記錄)

**用途**: 儲存 OTP 驗證請求與狀態。

**TypeORM Entity**:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum OTPStatus {
  PENDING = "pending", // 待驗證
  VERIFIED = "verified", // 已驗證
  EXPIRED = "expired", // 已過期
  LOCKED = "locked", // 已鎖定（嘗試次數過多）
}

export enum OTPPurpose {
  EXAM_ACCESS = "exam_access", // 測驗存取
  ADMIN_ACCESS = "admin_access", // 管理頁面存取
}

@Entity("otp_verifications")
export class OTPVerification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 6 })
  otp_code: string;

  @Column({ type: "enum", enum: OTPPurpose })
  purpose: OTPPurpose;

  @Column({ type: "enum", enum: OTPStatus, default: OTPStatus.PENDING })
  status: OTPStatus;

  @Column({ type: "varchar", length: 64 })
  device_fingerprint: string;

  @Column({ type: "int", default: 0 })
  attempt_count: number;

  @Column({ type: "timestamp", nullable: true })
  verified_at: Date;

  @Column({ type: "timestamp", nullable: true })
  locked_until: Date;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 關聯
  @ManyToOne(() => User, (user) => user.otp_verifications, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 36, nullable: true })
  user_id: string;
}
```

**資料庫表格** (`otp_verifications`):
| 欄位 | 型別 | 約束 | 說明 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID 主鍵 |
| user_id | VARCHAR(36) | FK, NULL | 使用者 ID（如已建立） |
| email | VARCHAR(255) | NOT NULL | 驗證 Email |
| otp_code | VARCHAR(6) | NOT NULL | 6 位數驗證碼 |
| purpose | ENUM | NOT NULL | 驗證目的 |
| status | ENUM | DEFAULT 'pending' | 驗證狀態 |
| device_fingerprint | VARCHAR(64) | NOT NULL | 裝置指紋（SHA-256） |
| attempt_count | INT | DEFAULT 0 | 嘗試次數 |
| verified_at | TIMESTAMP | NULL | 驗證成功時間 |
| locked_until | TIMESTAMP | NULL | 鎖定至（嘗試超過 10 次） |
| expires_at | TIMESTAMP | NOT NULL | 驗證碼過期時間（10 分鐘） |
| created_at | TIMESTAMP | NOT NULL | 建立時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引**:

- PRIMARY KEY (`id`)
- FOREIGN KEY (`user_id`) REFERENCES `users(id)`
- INDEX `idx_email` (`email`)
- INDEX `idx_status` (`status`)
- INDEX `idx_expires_at` (`expires_at`)
- INDEX `idx_device_fingerprint` (`device_fingerprint`)

**驗證規則**:

- `otp_code`: 6 位數字字串
- `attempt_count`: 達到 10 次時鎖定 5 分鐘

---

### 9. PaymentRecord (付款記錄)

**用途**: 儲存 Stripe 付款交易記錄。

**TypeORM Entity**:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum PaymentStatus {
  PENDING = "pending", // 待付款
  PROCESSING = "processing", // 處理中
  COMPLETED = "completed", // 已完成
  FAILED = "failed", // 失敗
  REFUNDED = "refunded", // 已退款
}

export enum PaymentType {
  INDIVIDUAL_EXAM = "individual_exam", // 個人測驗
  GROUP_EXAM = "group_exam", // 團體測驗
}

@Entity("payment_records")
export class PaymentRecord {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: PaymentType })
  payment_type: PaymentType;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3, default: "TWD" })
  currency: string;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ length: 255, nullable: true })
  stripe_checkout_session_id: string;

  @Column({ length: 255, nullable: true })
  stripe_payment_intent_id: string;

  @Column({ type: "varchar", length: 36, nullable: true })
  related_exam_id: string;

  @Column({ type: "varchar", length: 36, nullable: true })
  related_batch_id: string;

  @Column({ type: "timestamp", nullable: true })
  paid_at: Date;

  @Column({ type: "text", nullable: true })
  failure_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 關聯
  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 36 })
  user_id: string;
}
```

**資料庫表格** (`payment_records`):
| 欄位 | 型別 | 約束 | 說明 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID 主鍵 |
| user_id | VARCHAR(36) | FK, NOT NULL | 使用者 ID |
| payment_type | ENUM | NOT NULL | 付款類型 |
| amount | DECIMAL(10,2) | NOT NULL | 金額 |
| currency | VARCHAR(3) | DEFAULT 'TWD' | 貨幣 |
| quantity | INT | DEFAULT 1 | 數量 |
| status | ENUM | DEFAULT 'pending' | 付款狀態 |
| stripe_checkout_session_id | VARCHAR(255) | NULL | Stripe Session ID |
| stripe_payment_intent_id | VARCHAR(255) | NULL | Stripe Payment Intent ID |
| related_exam_id | VARCHAR(36) | NULL | 關聯測驗 ID（個人） |
| related_batch_id | VARCHAR(36) | NULL | 關聯批次 ID（團體） |
| paid_at | TIMESTAMP | NULL | 付款成功時間 |
| failure_reason | TEXT | NULL | 失敗原因 |
| created_at | TIMESTAMP | NOT NULL | 建立時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引**:

- PRIMARY KEY (`id`)
- FOREIGN KEY (`user_id`) REFERENCES `users(id)`
- INDEX `idx_user_id` (`user_id`)
- INDEX `idx_status` (`status`)
- INDEX `idx_stripe_session` (`stripe_checkout_session_id`)
- INDEX `idx_related_exam` (`related_exam_id`)
- INDEX `idx_related_batch` (`related_batch_id`)

---

### 10. Session (會話)

**用途**: 儲存使用者登入會話資訊。

**TypeORM Entity**:

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum SessionStatus {
  ACTIVE = "active", // 活躍中
  EXPIRED = "expired", // 已過期
  REVOKED = "revoked", // 已撤銷
}

@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 500 })
  refresh_token: string;

  @Column({ type: "varchar", length: 64 })
  device_fingerprint: string;

  @Column({ type: "text", nullable: true })
  user_agent: string;

  @Column({ length: 45, nullable: true })
  ip_address: string;

  @Column({ type: "enum", enum: SessionStatus, default: SessionStatus.ACTIVE })
  status: SessionStatus;

  @Column({ type: "timestamp", nullable: true })
  last_activity_at: Date;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 關聯
  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ type: "varchar", length: 36 })
  user_id: string;
}
```

**資料庫表格** (`sessions`):
| 欄位 | 型別 | 約束 | 說明 |
|------|------|------|------|
| id | VARCHAR(36) | PK | UUID 主鍵 |
| user_id | VARCHAR(36) | FK, NOT NULL | 使用者 ID |
| refresh_token | VARCHAR(500) | NOT NULL | JWT Refresh Token |
| device_fingerprint | VARCHAR(64) | NOT NULL | 裝置指紋 |
| user_agent | TEXT | NULL | User-Agent |
| ip_address | VARCHAR(45) | NULL | IP 位址（支援 IPv6） |
| status | ENUM | DEFAULT 'active' | 會話狀態 |
| last_activity_at | TIMESTAMP | NULL | 最後活動時間 |
| expires_at | TIMESTAMP | NOT NULL | 會話過期時間 |
| created_at | TIMESTAMP | NOT NULL | 建立時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引**:

- PRIMARY KEY (`id`)
- FOREIGN KEY (`user_id`) REFERENCES `users(id)`
- INDEX `idx_user_device` (`user_id`, `device_fingerprint`)
- INDEX `idx_status` (`status`)
- INDEX `idx_expires_at` (`expires_at`)

**驗證規則**:

- 受測者會話: `expires_at` 為 10 天
- 管理者會話: 1 小時無活動自動過期

---

## 資料庫設計原則

### 命名規範

- **表格名稱**: 複數形式，snake_case（如 `users`, `answer_records`）
- **欄位名稱**: snake_case（如 `created_at`, `user_id`）
- **外鍵欄位**: `{referenced_table}_id`（如 `user_id`, `exam_id`）
- **索引名稱**: `idx_{column}` 或 `idx_{table}_{column}`

### 型別選擇

- **主鍵**: UUID (VARCHAR(36))
- **狀態欄位**: ENUM
- **時間戳**: TIMESTAMP (自動 UTC)
- **JSON 欄位**: JSON（MySQL 8.0 原生支援）
- **金額**: DECIMAL(10,2)

### 索引策略

1. **主鍵索引**: 所有表格
2. **外鍵索引**: 所有關聯欄位
3. **查詢索引**: 常用 WHERE 條件（status, expires_at, created_at）
4. **唯一索引**: email, access_token 等唯一欄位
5. **複合索引**: 常見組合查詢（user_id + device_fingerprint）

### 效能考量

- 適當使用索引（避免過度索引）
- JSON 欄位僅用於非查詢資料（statistics, question_sequence）
- 軟刪除欄位（deleted_at）僅在必要時使用
- 分頁查詢使用 LIMIT + OFFSET

### 資料完整性

- 外鍵約束確保參照完整性
- 應用層驗證補充資料庫約束
- 定期清理過期資料（expired sessions, old OTP records）

---

## 資料遷移與種子資料

### TypeORM 遷移指令

```bash
# 生成遷移檔案
npm run migration:generate -- -n InitialSchema

# 執行遷移
npm run migration:run

# 回滾遷移
npm run migration:revert
```

### 種子資料需求

1. **Questions + CellImages**:

   - 末梢血版: 100 題 × 10 張圖片 = 1000 張圖片
   - 骨髓版: 100 題 × 10 張圖片 = 1000 張圖片

2. **管理者帳號**:

   - 系統管理員（用於測試與維護）

3. **測試資料**:
   - 測試使用者
   - 測試測驗實例
   - 測試答案記錄

---

## 下一步

資料模型已定義完成，接下來進入 **API 合約設計（contracts/）**，定義所有 RESTful API 端點與 OpenAPI 規格。
