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
import { Student } from './student.entity';
import { TeacherClasses } from './teacher-classes.entity';
import { SubjectClasses } from './subject-classes.entity';
import { User } from './user.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];

  @OneToMany(() => TeacherClasses, (tc) => tc.class)
  teachers: TeacherClasses[];

  @OneToMany(() => SubjectClasses, (sc) => sc.class)
  subject: SubjectClasses[];

  @Column({ name: 'user_id', type: 'simple-array', nullable: true })
  userId: string[];

  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}