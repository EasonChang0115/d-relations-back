import { DataSource } from 'typeorm';
import { CellImage } from '../../modules/questions/entities/cell-image.entity';
import { ExamType } from '../../common/constants';

const PERIPHERAL_BLOOD_CELLS = [
  'neutrophil_band',
  'neutrophil_segment',
  'eosinophil',
  'basophil',
  'lymphocyte',
  'monocyte',
  'atypical_lymphocyte',
];

const BONE_MARROW_CELLS = [
  'myeloblast',
  'promyelocyte',
  'myelocyte',
  'metamyelocyte',
  'proerythroblast',
  'basophilic_erythroblast',
  'polychromatic_erythroblast',
  'orthochromatic_erythroblast',
  'plasma_cell',
  'megakaryocyte',
];

export async function seedCellImages(dataSource: DataSource): Promise<void> {
  const cellImageRepository = dataSource.getRepository(CellImage);

  console.log('🌱 Seeding cell images...');

  const images: CellImage[] = [];

  // Seed peripheral blood cell images (7 types × 10 images each)
  for (const cellType of PERIPHERAL_BLOOD_CELLS) {
    for (let i = 1; i <= 10; i++) {
      const image = cellImageRepository.create({
        cellType,
        examType: ExamType.PERIPHERAL_BLOOD,
        imageUrl: `https://medical-cell-test.s3.ap-northeast-1.amazonaws.com/peripheral/${cellType}_${i}.jpg`,
        thumbnailUrl: `https://medical-cell-test.s3.ap-northeast-1.amazonaws.com/peripheral/thumb/${cellType}_${i}_thumb.jpg`,
        fileName: `${cellType}_${i}.jpg`,
        fileSize: 150000 + Math.floor(Math.random() * 50000),
        mimeType: 'image/jpeg',
        width: 1024,
        height: 768,
        description: `${cellType} sample image ${i}`,
        isActive: true,
      });
      images.push(image);
    }
  }

  // Seed bone marrow cell images (10 types × 10 images each)
  for (const cellType of BONE_MARROW_CELLS) {
    for (let i = 1; i <= 10; i++) {
      const image = cellImageRepository.create({
        cellType,
        examType: ExamType.BONE_MARROW,
        imageUrl: `https://medical-cell-test.s3.ap-northeast-1.amazonaws.com/bone-marrow/${cellType}_${i}.jpg`,
        thumbnailUrl: `https://medical-cell-test.s3.ap-northeast-1.amazonaws.com/bone-marrow/thumb/${cellType}_${i}_thumb.jpg`,
        fileName: `${cellType}_${i}.jpg`,
        fileSize: 150000 + Math.floor(Math.random() * 50000),
        mimeType: 'image/jpeg',
        width: 1024,
        height: 768,
        description: `${cellType} sample image ${i}`,
        isActive: true,
      });
      images.push(image);
    }
  }

  await cellImageRepository.save(images);

  console.log(`✅ Created ${images.length} cell images`);
  console.log(`   - Peripheral Blood: ${PERIPHERAL_BLOOD_CELLS.length * 10} images`);
  console.log(`   - Bone Marrow: ${BONE_MARROW_CELLS.length * 10} images`);
}
