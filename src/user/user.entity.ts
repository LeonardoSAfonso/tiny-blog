import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import HashProvider from 'src/shared/providers/hashProvider/hashProvider';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  @Column({ transformer: HashProvider, nullable: true })
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
