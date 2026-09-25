import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity('education')
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  school: string;

  @Column({ type: 'int' })
  degree: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  field: string;

  @Column({ name: 'teacher_id', nullable: true })
  teacherId: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.education)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ name: 'from_date', type: 'timestamp' })
  from: Date;

  @Column({ name: 'to_date', type: 'timestamp' })
  to: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}