export enum ExamType {
  PERIPHERAL_BLOOD = 'peripheral_blood',
  BONE_MARROW = 'bone_marrow',
}

export enum ExamStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export enum ExamVersion {
  FREE = 'free',
  PAID = 'paid',
  GROUP = 'group',
}

export const EXAM_CONFIG = {
  FREE: {
    questionCount: 15,
    validityDays: 7,
    price: 0,
  },
  PAID: {
    questionCount: 100,
    validityDays: 30,
    price: 200,
  },
  GROUP: {
    questionCount: 100,
    validityDays: 365,
    minMembers: 10,
  },
};
