import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IChatMember } from '../interfaces/IChatMemeber';
import { IChatroom } from '../interfaces/IChatroom';
import { IUser } from '../interfaces/IUser';
import { Chatroom } from './chatroom.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Index('user_id', ['userId'], {})
@Entity({ name: 'chat_member' })
export class ChatMember implements IChatMember {
  @ApiProperty({
    type: 'number',
    description: 'chatroom member id',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'chatroom_member_id' })
  chatroomMemberId: number;

  @ApiProperty({
    type: 'number',
    description: 'user id',
  })
  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @ApiProperty({
    type: 'number',
    description: 'chatroom id',
  })
  @Column({ type: 'int', name: 'chatroom_id' })
  chatroomId: number;

  @ApiProperty({
    description: 'muted time',
  })
  @Column({
    type: 'timestamp',
    name: 'muted_date',
    nullable: true,
    default: null,
  })
  mutedDate: Date | null;

  @ApiProperty({
    description: 'ban time',
  })
  @Column({
    type: 'timestamp',
    name: 'ban_date',
    nullable: true,
    default: null,
  })
  banDate: Date | null;

  @ApiProperty({
    description: 'created time',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at', select: false })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'created time',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'modified_at', select: false })
  readonly modifiedAt: Date;

  @ManyToOne((type) => Chatroom, (Chatroom) => Chatroom.ChatMember)
  @JoinColumn({ name: 'chatroom_id', referencedColumnName: 'chatroomId' })
  Chatroom: IChatroom;

  @ManyToOne((type) => User, (User) => User.ChatMember)
  @JoinColumn({ name: 'user', referencedColumnName: 'id' })
  User: IUser;
}
