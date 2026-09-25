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
import { Subject } from './subject.entity';
import { TeacherClasses } from './teacher-classes.entity';
import { Education } from './education.entity';
import { Experience } from './experience.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.teacher)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => TeacherClasses, (tc) => tc.teacher)
  classes: TeacherClasses[];

  @Column({ name: 'subject_id', nullable: true })
  subjectId: string;

  @ManyToOne(() => Subject, (subject) => subject.teacher)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @OneToMany(() => Education, (education) => education.teacher)
  education: Education[];

  @OneToMany(() => Experience, (experience) => experience.teacher)
  experience: Experience[];
}