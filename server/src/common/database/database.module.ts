import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  User,
  Student,
  Teacher,
  Parent,
  Class,
  Subject,
  Course,
  Chapter,
  Content,
  Exam,
  Grade,
  Payment,
  Group,
  GroupMembership,
  Education,
  Experience,
  Session,
  Account,
  VerificationToken,
  TeacherClasses,
  SubjectClasses,
} from '../entities';

const entities = [
  User,
  Student,
  Teacher,
  Parent,
  Class,
  Subject,
  Course,
  Chapter,
  Content,
  Exam,
  Grade,
  Payment,
  Group,
  GroupMembership,
  Education,
  Experience,
  Session,
  Account,
  VerificationToken,
  TeacherClasses,
  SubjectClasses,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        migrations: ['src/common/database/migrations/*.ts'],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}