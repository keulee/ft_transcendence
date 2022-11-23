import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IDmService } from 'src/chat/services/dm/dm.interface';

@ApiTags('DM')
@Controller('dm')
export class DmController {
  constructor(@Inject('DM_SERVICE') private dmSerivce: IDmService) {}
  @ApiOperation({
    summary: 'Get messages for a DM / 특정 디엠의 대화내용 가져오기',
  })
  @Get(':dm_id/messages')
  getMessages() {}

  @ApiOperation({ summary: 'post messages / 특정 디엠에 대화내용 입력하기' })
  @Post(':dm_id/messages')
  postMessage() {}
}
