import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postStatus, postType } from './enums';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
    length: 512,
    type: 'varchar',
  })
  title: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  content?: string;

  @Column({
    nullable: true,
    length: 96,
    enum: postType,
    default: postType.POST,
  })
  postType: postType;

  @Column({
    unique: true,
    nullable: false,
    length: 256,
    type: 'varchar',
  })
  slug: string;

  @Column({
    nullable: false,
    length: 96,
    enum: postStatus,
    default: postStatus.DRAFT,
  })
  status: postStatus;

  @Column({
    nullable: true,
    type: 'text',
  })
  schema?: string;
  @Column({
    nullable: true,
    length: 1024,
    type: 'varchar',
  })
  featuredImageUrl?: string;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  publishOn?: Date;

  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, {
    cascade: true,
    eager: true,
  })
  metaOptions?: MetaOption | null;

  @ManyToOne(() => Tag, (tag) => tag.posts, {
    eager: true,
  })
  @JoinTable()
  tags?: Tag[];

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
