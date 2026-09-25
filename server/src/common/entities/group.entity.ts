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
import { GroupMembership } from './group-membership.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.group)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => GroupMembership, (membership) => membership.group)
  memberships: GroupMembership[];

  @OneToMany(() => GroupMembership, (membership) => membership.adminGroup)
  admins: GroupMembership[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}