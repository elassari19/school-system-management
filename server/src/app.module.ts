import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './common/database/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ClassModule } from './class/class.module';
import { SubjectModule } from './subject/subject.module';
import { CourseModule } from './course/course.module';
import { ChapterModule } from './chapter/chapter.module';
import { ContentModule } from './content/content.module';
import { GroupModule } from './group/group.module';
import { PaymentModule } from './payment/payment.module';
import { EventModule } from './event/event.module';
import { CacheModule } from './common/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CacheModule,
    AuthModule,
    UserModule,
    StudentModule,
    TeacherModule,
    ClassModule,
    SubjectModule,
    CourseModule,
    ChapterModule,
    ContentModule,
    GroupModule,
    PaymentModule,
    EventModule,
  ],
})
export class AppModule {}