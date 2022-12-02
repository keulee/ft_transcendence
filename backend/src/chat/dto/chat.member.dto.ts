import { PickType, OmitType } from '@nestjs/swagger';
import { ChatMember } from 'src/typeorm';
export class ChatMemberDto extends OmitType(ChatMember, [
  'User',
  'createdAt',
  'modifiedAt',
]) {}
