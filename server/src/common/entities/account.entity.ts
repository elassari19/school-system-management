import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('accounts')
@Unique(['provider', 'providerAccountId'])
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  type: string;

  @Column()
  provider: string;

  @Column({ name: 'provider_account_id' })
  providerAccountId: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken: string;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: number;

  @Column({ name: 'token_type', nullable: true })
  tokenType: string;

  @Column({ nullable: true })
  scope: string;

  @Column({ name: 'id_token', nullable: true })
  idToken: string;

  @Column({ name: 'session_state', nullable: true })
  sessionState: string;

  @ManyToOne(() => User, (user) => user.account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}