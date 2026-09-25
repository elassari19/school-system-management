import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Teacher } from './teacher.entity';
import { Class } from './class.entity';

@Entity('teacher_classes')
@Unique(['teacherId', 'classId'])
@Index(['classId'])
export class TeacherClasses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @Column({ name: 'class_id' })
  classId: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.classes)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @ManyToOne(() => Class, (cls) => cls.teachers)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}