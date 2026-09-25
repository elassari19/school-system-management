import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Grade } from './grade.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'due_date', type: 'timestamp' })
  dueDate: Date;

  @Column({ name: 'course_id' })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.exams)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Grade, (grade) => grade.exam)
  grade: Grade[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}