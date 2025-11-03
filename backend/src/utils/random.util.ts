import * as crypto from 'crypto';
import seedrandom from 'seedrandom';

/**
 * 生成確定性種子 (Deterministic Seed)
 * 使用 SHA-256 雜湊确保相同的輸入產生相同的種子
 * @param input 輸入值 (batch ID, session ID 等)
 * @returns 數字種子
 */
export function generateSeed(input: string): string {
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  // 取 hash 的前 16 個字符作為種子
  return hash.substring(0, 16);
}

/**
 * 建立帶種子的隨機數生成器 (Seeded RNG)
 * 使用 Mersenne Twister 演算法確保品質隨機性
 * @param seed 種子字符串
 * @returns seedrandom 的 RNG 實例
 */
export function createSeededRNG(seed: string): seedrandom.PRNG {
  return seedrandom(seed);
}

/**
 * 從陣列中根據種子隨機選擇指定數量的元素
 * 實作 Fisher-Yates 洗牌演算法
 * @param items 元素陣列
 * @param count 要選擇的數量
 * @param seed 種子字符串
 * @returns 隨機選擇的元素陣列
 */
export function selectRandomItems<T>(
  items: T[],
  count: number,
  seed: string,
): T[] {
  if (count > items.length) {
    throw new Error(`無法選擇 ${count} 個元素，陣列只有 ${items.length} 個`);
  }

  const rng = createSeededRNG(seed);
  const shuffled = [...items];

  // Fisher-Yates 洗牌
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

/**
 * 從陣列中根據種子隨機選擇單一元素
 * @param items 元素陣列
 * @param seed 種子字符串
 * @returns 隨機選擇的單一元素
 */
export function selectRandomItem<T>(items: T[], seed: string): T {
  const rng = createSeededRNG(seed);
  const index = Math.floor(rng() * items.length);
  return items[index];
}

/**
 * 根據批次 ID 生成確定性的題目順序
 * @param questionIds 題目 ID 陣列
 * @param count 要選擇的題目數量
 * @param batchId 批次 ID (用於生成種子)
 * @returns 隨機選擇的題目 ID 陣列
 */
export function generateDeterministicQuestionOrder(
  questionIds: string[],
  count: number,
  batchId: string,
): string[] {
  const seed = generateSeed(batchId);
  return selectRandomItems(questionIds, count, seed);
}

/**
 * 為單一問題的圖片集合中隨機選擇一張
 * @param imageIds 圖片 ID 陣列
 * @param seed 種子字符串
 * @returns 隨機選擇的圖片 ID
 */
export function selectRandomImage(imageIds: string[], seed: string): string {
  return selectRandomItem(imageIds, seed);
}
