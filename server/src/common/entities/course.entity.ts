import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Chapter } from './chapter.entity';
import { Grade } from './grade.entity';
import { Exam } from './exam.entity';
import { Subject } from './subject.entity';
import { User } from './user.entity';
import { Level } from './enums';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  instructor: string;

  @Column({ nullable: true })
  duration: number;

  @Column({
    type: 'enum',
    enum: Level,
    nullable: true,
  })
  level: Level;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @OneToMany(() => Chapter, (chapter) => chapter.course)
  chapters: Chapter[];

  @Column({ nullable: true })
  thumbnail: string;

  @OneToMany(() => Grade, (grade) => grade.course)
  grade: Grade[];

  @OneToMany(() => Exam, (exam) => exam.course)
  exams: Exam[];

  @Column({ name: 'subject_id' })
  subjectId: string;

  @ManyToOne(() => Subject, (subject) => subject.courses)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.courses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}