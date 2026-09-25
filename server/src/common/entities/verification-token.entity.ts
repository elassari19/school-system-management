import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('verification_tokens')
@Unique(['identifier', 'token'])
export class VerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identifier: string;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'expires', type: 'timestamp' })
  expires: Date;

  @CreateDateColumn()
  createdAt: Date;
}