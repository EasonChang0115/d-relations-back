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

// Cell type labels mapping
export const CELL_TYPE_LABELS: Record<string, string> = {
  neutrophil: '嗜中性球',
  lymphocyte: '淋巴球',
  monocyte: '單核球',
  eosinophil: '嗜酸性球',
  basophil: '嗜鹼性球',
  blast: '胚細胞',
  promyelocyte: '前骨髓球',
  myelocyte: '骨髓球',
  metamyelocyte: '後骨髓球',
  band: '帶狀球',
  erythroblast: '紅血球母細胞',
  platelet: '血小板',
};
