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
import { Subject } from './subject.entity';
import { Class } from './class.entity';

@Entity('subject_classes')
@Unique(['subjectId', 'classId'])
@Index(['classId'])
export class SubjectClasses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subject_id' })
  subjectId: string;

  @Column({ name: 'class_id' })
  classId: string;

  @ManyToOne(() => Subject, (subject) => subject.classes)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Class, (cls) => cls.subject)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}