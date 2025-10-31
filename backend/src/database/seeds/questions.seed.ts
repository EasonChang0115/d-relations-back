import { DataSource } from 'typeorm';
import { Question } from '../../modules/questions/entities/question.entity';
import { CellImage } from '../../modules/questions/entities/cell-image.entity';
import { ExamType } from '../../common/constants';
import { CELL_TYPE_LABELS } from '../../common/constants';

export async function seedQuestions(dataSource: DataSource): Promise<void> {
  const questionRepository = dataSource.getRepository(Question);
  const cellImageRepository = dataSource.getRepository(CellImage);

  console.log('🌱 Seeding questions...');

  // Get all cell images
  const cellImages = await cellImageRepository.find({ where: { isActive: true } });

  if (cellImages.length === 0) {
    console.log('⚠️  No cell images found. Please run cell-images seed first.');
    return;
  }

  const questions: Question[] = [];

  // Group images by exam type and cell type
  const imagesByType = new Map<string, CellImage[]>();
  for (const image of cellImages) {
    const key = `${image.examType}-${image.cellType}`;
    if (!imagesByType.has(key)) {
      imagesByType.set(key, []);
    }
    imagesByType.get(key)!.push(image);
  }

  // Create questions for each image
  let questionCount = 0;
  for (const [key, images] of imagesByType.entries()) {
    const [examType, cellType] = key.split('-');

    for (const image of images) {
      const question = questionRepository.create({
        examType: examType as ExamType,
        cellType,
        correctAnswer: CELL_TYPE_LABELS[cellType] || cellType,
        imageId: image.id,
        description: `請辨識此細胞類型`,
        difficulty: 1,
        isActive: true,
      });
      questions.push(question);
      questionCount++;
    }
  }

  await questionRepository.save(questions);

  // Count by exam type
  const peripheralCount = questions.filter(
    (q) => q.examType === ExamType.PERIPHERAL_BLOOD,
  ).length;
  const boneMarrowCount = questions.filter(
    (q) => q.examType === ExamType.BONE_MARROW,
  ).length;

  console.log(`✅ Created ${questionCount} questions`);
  console.log(`   - Peripheral Blood: ${peripheralCount} questions`);
  console.log(`   - Bone Marrow: ${boneMarrowCount} questions`);
}
