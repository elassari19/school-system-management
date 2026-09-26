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
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity('group_memberships')
@Unique(['userId', 'groupId'])
@Index(['groupId'])
export class GroupMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin: boolean;

  @ManyToOne(() => User, (user) => user.memberships)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group, (group) => group.memberships)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @ManyToOne(() => User, (user) => user.adminGroups)
  adminUser: User;

  @ManyToOne(() => Group, (group) => group.admins)
  adminGroup: Group;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}