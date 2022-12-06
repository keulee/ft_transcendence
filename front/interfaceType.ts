export interface TokenType {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserInfo {
  intra_id: string;
  email: string;
  image_url: string;
  username: string;
  created_at: Date;
  modified_at: Date;
  hashed_refresh_token: string;
  two_factor_activated: boolean;
  two_factor_secret: string;
  two_factor_valid: boolean;
}

export interface infoOfHistory {
  winOrLoss: string;
  firstPlayer: string;
  secondPlayer: string;
  point: string;
}

export interface XYType {
  x: number;
  y: number;
}

export interface IChatroom {
  id: number;
  ownerId: number;
  chatroomName: string;
  isPrivate: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export interface IChatMember {
  id: number;
  userId: number;
  chatroomId: number;
  mutedDate: Date;
  banDate: Date;
  createdAt: Date;
  modifiedAt: Date;
  User: {
    username: string;
  };
}

export interface IChatContent {
  id: number;
  chatroomId: number;
  userId: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  User: {
    username: string;
  };
}

export interface IDm {
  id: number;
  user1: number;
  user2: number;
  createdAt: Date;
  modifiedAt: Date;
  // User1: IUser;
  // User2: IUser;
  // DmContent: IDmContent[];
}

export interface IDmContent {
  id: number;
  dmId: number;
  userId: number;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
  Dm: IDm;
  // User: IUser;
}

export interface GameDTO {
  Players: Array<any>;
  roomName: string;
  ownerId: string;
  speed: string;
  ballSize: string;
}

export interface TypeChatId {
  id: string;
  link: string;
}
