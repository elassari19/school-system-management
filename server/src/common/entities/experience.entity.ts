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

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column({ nullable: true })
  certificate: string;

  @Column({ name: 'teacher_id', nullable: true })
  teacherId: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.experience)
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