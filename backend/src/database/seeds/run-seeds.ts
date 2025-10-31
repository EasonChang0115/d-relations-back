import { AppDataSource } from '../data-source';
import { seedCellImages } from './cell-images.seed';
import { seedQuestions } from './questions.seed';

async function runSeeds() {
  console.log('🚀 Starting database seeding...\n');

  try {
    // Initialize data source
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    // Run seeds in order
    await seedCellImages(AppDataSource);
    console.log('');
    await seedQuestions(AppDataSource);
    console.log('');

    console.log('🎉 All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('\n✅ Database connection closed');
  }
}

runSeeds();
