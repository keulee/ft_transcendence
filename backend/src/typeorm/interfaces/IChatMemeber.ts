import { IChatroom } from './IChatroom';
import { IUser } from './IUser';

export interface IChatMember {
  id: number;
  userId: number;
  chatroomId: number;
  mutedDate: Date;
  banDate: Date;
  createdAt: Date;
  modifiedAt: Date;
  Chatroom: IChatroom;
  User: IUser;
}
