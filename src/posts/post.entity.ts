import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { postStatus, postType } from './enums';
import { CreatePostMetaOptionsDto } from '../meta-options/dtos/create-post-meta-options.dto';

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
  tags?: string[];
  metaOptions?: CreatePostMetaOptionsDto[];
}
