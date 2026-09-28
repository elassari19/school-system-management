import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Chapter } from './chapter.entity';
import { ContentType } from './enums';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  type: ContentType;

  @Column()
  title: string;

  @Index()
  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @ManyToOne(() => Chapter, (chapter) => chapter.content)
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter;

  @Column({ name: 'chapter_id' })
  chapterId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}