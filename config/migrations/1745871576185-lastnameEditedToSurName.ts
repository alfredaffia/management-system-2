import { MigrationInterface, QueryRunner } from "typeorm";

export class LastnameEditedToSurName1745871576185 implements MigrationInterface {
    name = 'LastnameEditedToSurName1745871576185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`lastName\` \`surName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`surName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`surName\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`surName\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`surName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`surName\` \`lastName\` varchar(255) NOT NULL`);
    }

}
