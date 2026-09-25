import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { Course } from './course.entity';
import { Exam } from './exam.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  score: number;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => Student, (student) => student.grade)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'course_id', nullable: true })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.grade)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'exam_id', nullable: true })
  examId: string;

  @ManyToOne(() => Exam, (exam) => exam.grade)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}