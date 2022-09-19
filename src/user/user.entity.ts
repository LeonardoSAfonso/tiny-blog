import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import Post from 'src/post/post.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import HashProvider from '../shared/providers/hashProvider/hashProvider';

@ObjectType()
@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @HideField()
  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  first_access: boolean;

  @Column({ default: false })
  email_checked: boolean;

  @Column({ nullable: true })
  forgotten_token?: string;

  @Column({ nullable: true, type: 'timestamp' })
  token_expiresin?: Date;

  @Column({ default: 1 })
  access_level: number;

  @OneToMany(() => Post, post => post.user)
  @JoinColumn({ name: 'user_id' })
  posts: Post[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword() {
    this.password = HashProvider.to(this.password);
  }
}
