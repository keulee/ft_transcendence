import { IDmContent } from './IDmContent';
import { IUser } from './IUser';

export interface IDm {
  id: number;
  user1: number;
  user2: number;
  // content: string;
  createdAt: Date;
  modifiedAt: Date;
  User1: IUser;
  User2: IUser;
  DmContent: IDmContent[];
}
