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
import { User } from './user.entity';
import { Course } from './course.entity';
import { Teacher } from './teacher.entity';
import { SubjectClasses } from './subject-classes.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.subjects)
  @JoinColumn({ name: 'user_id' })
  createdBy: User;

  @OneToMany(() => Course, (course) => course.subject)
  courses: Course[];

  @OneToMany(() => Teacher, (teacher) => teacher.subject)
  teacher: Teacher[];

  @OneToMany(() => SubjectClasses, (sc) => sc.subject)
  classes: SubjectClasses[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}