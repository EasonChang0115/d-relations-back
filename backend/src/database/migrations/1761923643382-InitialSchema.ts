import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1761923643382 implements MigrationInterface {
    name = 'InitialSchema1761923643382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`cell_images\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`cell_type\` varchar(50) NOT NULL, \`exam_type\` enum ('peripheral_blood', 'bone_marrow') NOT NULL, \`image_url\` varchar(500) NOT NULL, \`thumbnail_url\` varchar(500) NULL, \`file_name\` varchar(100) NULL, \`file_size\` int NULL, \`mime_type\` varchar(50) NULL, \`width\` int NULL, \`height\` int NULL, \`description\` text NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, INDEX \`idx_exam_type\` (\`exam_type\`), INDEX \`idx_cell_type\` (\`cell_type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questions\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`exam_type\` enum ('peripheral_blood', 'bone_marrow') NOT NULL, \`cell_type\` varchar(50) NOT NULL, \`correct_answer\` varchar(100) NOT NULL, \`image_id\` varchar(255) NOT NULL, \`description\` text NULL, \`difficulty\` int NOT NULL DEFAULT '1', \`is_active\` tinyint NOT NULL DEFAULT 1, INDEX \`idx_cell_type\` (\`cell_type\`), INDEX \`idx_exam_type\` (\`exam_type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`answer_records\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`exam_id\` varchar(255) NOT NULL, \`question_id\` varchar(255) NOT NULL, \`question_order\` int NOT NULL, \`user_answer\` varchar(100) NOT NULL, \`correct_answer\` varchar(100) NOT NULL, \`is_correct\` tinyint NOT NULL, \`time_spent_seconds\` int NULL, \`answered_at\` timestamp NOT NULL, INDEX \`idx_is_correct\` (\`is_correct\`), INDEX \`idx_question_id\` (\`question_id\`), INDEX \`idx_exam_id\` (\`exam_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`result_reports\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`exam_id\` varchar(255) NOT NULL, \`total_questions\` int NOT NULL, \`correct_answers\` int NOT NULL, \`wrong_answers\` int NOT NULL, \`accuracy_rate\` decimal(5,2) NOT NULL, \`total_time_seconds\` int NULL, \`avg_time_per_question\` decimal(8,2) NULL, \`cell_type_stats\` json NULL, \`generated_at\` timestamp NOT NULL, \`expires_at\` timestamp NOT NULL, \`is_expired\` tinyint NOT NULL DEFAULT 0, INDEX \`idx_expires_at\` (\`expires_at\`), INDEX \`idx_exam_id\` (\`exam_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exams\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`user_id\` varchar(255) NULL, \`session_id\` varchar(255) NULL, \`exam_type\` enum ('peripheral_blood', 'bone_marrow') NOT NULL, \`version\` enum ('free', 'paid', 'group') NOT NULL DEFAULT 'free', \`status\` enum ('not_started', 'in_progress', 'completed', 'expired') NOT NULL DEFAULT 'not_started', \`total_questions\` int NOT NULL, \`current_question\` int NOT NULL DEFAULT '0', \`question_sequence\` json NOT NULL, \`random_seed\` varchar(64) NULL, \`started_at\` timestamp NULL, \`completed_at\` timestamp NULL, \`expires_at\` timestamp NULL, \`time_spent_seconds\` int NULL, INDEX \`idx_session_id\` (\`session_id\`), INDEX \`idx_version\` (\`version\`), INDEX \`idx_status\` (\`status\`), INDEX \`idx_user_id\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`name\` varchar(100) NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`phone\` varchar(20) NULL, \`role\` enum ('admin', 'group_manager', 'taker', 'guest') NOT NULL DEFAULT 'guest', \`session_id\` varchar(255) NULL, \`institution\` varchar(100) NULL, \`department\` varchar(100) NULL, \`job_title\` varchar(50) NULL, \`email_verified\` tinyint NOT NULL DEFAULT 0, \`last_login_at\` timestamp NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, INDEX \`idx_session_id\` (\`session_id\`), INDEX \`idx_email\` (\`email\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_c3a97cface66e060976f19bb9a6\` FOREIGN KEY (\`image_id\`) REFERENCES \`cell_images\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`answer_records\` ADD CONSTRAINT \`FK_e4d80038d5ac84a42d4a1c6b572\` FOREIGN KEY (\`exam_id\`) REFERENCES \`exams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`answer_records\` ADD CONSTRAINT \`FK_e033beeeefc74e124371e5bdab8\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`result_reports\` ADD CONSTRAINT \`FK_94a95a74d18aae6ef5333c9fe57\` FOREIGN KEY (\`exam_id\`) REFERENCES \`exams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exams\` ADD CONSTRAINT \`FK_2571a05d2f6d3474755677cc015\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exams\` DROP FOREIGN KEY \`FK_2571a05d2f6d3474755677cc015\``);
        await queryRunner.query(`ALTER TABLE \`result_reports\` DROP FOREIGN KEY \`FK_94a95a74d18aae6ef5333c9fe57\``);
        await queryRunner.query(`ALTER TABLE \`answer_records\` DROP FOREIGN KEY \`FK_e033beeeefc74e124371e5bdab8\``);
        await queryRunner.query(`ALTER TABLE \`answer_records\` DROP FOREIGN KEY \`FK_e4d80038d5ac84a42d4a1c6b572\``);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_c3a97cface66e060976f19bb9a6\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`idx_email\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`idx_session_id\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`idx_user_id\` ON \`exams\``);
        await queryRunner.query(`DROP INDEX \`idx_status\` ON \`exams\``);
        await queryRunner.query(`DROP INDEX \`idx_version\` ON \`exams\``);
        await queryRunner.query(`DROP INDEX \`idx_session_id\` ON \`exams\``);
        await queryRunner.query(`DROP TABLE \`exams\``);
        await queryRunner.query(`DROP INDEX \`idx_exam_id\` ON \`result_reports\``);
        await queryRunner.query(`DROP INDEX \`idx_expires_at\` ON \`result_reports\``);
        await queryRunner.query(`DROP TABLE \`result_reports\``);
        await queryRunner.query(`DROP INDEX \`idx_exam_id\` ON \`answer_records\``);
        await queryRunner.query(`DROP INDEX \`idx_question_id\` ON \`answer_records\``);
        await queryRunner.query(`DROP INDEX \`idx_is_correct\` ON \`answer_records\``);
        await queryRunner.query(`DROP TABLE \`answer_records\``);
        await queryRunner.query(`DROP INDEX \`idx_exam_type\` ON \`questions\``);
        await queryRunner.query(`DROP INDEX \`idx_cell_type\` ON \`questions\``);
        await queryRunner.query(`DROP TABLE \`questions\``);
        await queryRunner.query(`DROP INDEX \`idx_cell_type\` ON \`cell_images\``);
        await queryRunner.query(`DROP INDEX \`idx_exam_type\` ON \`cell_images\``);
        await queryRunner.query(`DROP TABLE \`cell_images\``);
    }

}
