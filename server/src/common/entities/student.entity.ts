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
import { User } from './user.entity';
import { Grade } from './grade.entity';
import { Parent } from './parent.entity';
import { Class } from './class.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.student)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Grade, (grade) => grade.student)
  grade: Grade[];

  @Column({ name: 'parent_id' })
  parentId: string;

  @ManyToOne(() => Parent, (parent) => parent.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Parent;

  @Column({ name: 'class_id' })
  classId: string;

  @ManyToOne(() => Class, (cls) => cls.students)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ type: 'float', default: 92.5 })
  attendence: number;

  @Column({ default: 'Active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}