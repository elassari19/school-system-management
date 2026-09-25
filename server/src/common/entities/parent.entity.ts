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
import { Payment } from './payment.entity';
import { Student } from './student.entity';

@Entity('parents')
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.parent)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Payment, (payment) => payment.parent)
  payments: Payment[];

  @OneToMany(() => Student, (student) => student.parent)
  children: Student[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}