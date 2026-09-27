import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './enums';
import { Student } from './student.entity';
import { Teacher } from './teacher.entity';
import { Parent } from './parent.entity';
import { Class } from './class.entity';
import { Subject } from './subject.entity';
import { Course } from './course.entity';
import { Group } from './group.entity';
import { GroupMembership } from './group-membership.entity';
import { Session } from './session.entity';
import { Account } from './account.entity';
import { Event } from './event.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  fullname: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PARENT,
  })
  role: Role;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true, type: 'float' })
  salary: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Student, (student) => student.user)
  student: Student[];

  @OneToMany(() => Teacher, (teacher) => teacher.user)
  teacher: Teacher[];

  @OneToMany(() => Parent, (parent) => parent.user)
  parent: Parent[];

  @OneToMany(() => Class, (cls) => cls.user)
  classes: Class[];

  @OneToMany(() => Subject, (subject) => subject.createdBy)
  subjects: Subject[];

  @OneToMany(() => Course, (course) => course.user)
  courses: Course[];

  @OneToMany(() => Group, (group) => group.user)
  group: Group[];

  @OneToMany(() => GroupMembership, (membership) => membership.user)
  memberships: GroupMembership[];

  @OneToMany(() => GroupMembership, (membership) => membership.adminUser)
  adminGroups: GroupMembership[];

  @OneToMany(() => Session, (session) => session.user)
  session: Session[];

  @OneToMany(() => Account, (account) => account.user)
  account: Account[];

  @OneToMany(() => Event, (event) => event.createdBy)
  events: Event[];
}