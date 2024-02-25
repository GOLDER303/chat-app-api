import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { ChatOwnerGuard } from 'src/common/guards/chat-owner.guard';
import { ChatUsersService } from './chat-users.service';
import { UsersIdsDTO } from './dto/user-ids.dto';

@Controller('chats/:chatId/users')
@UseGuards(AccessTokenGuard, ChatOwnerGuard)
export class ChatUsersController {
  constructor(private readonly chatUsersService: ChatUsersService) {}

  @Post('/')
  async addUsersToChat(
    @Param('chatId') chatId: string,
    @Body() usersIds: UsersIdsDTO,
  ) {
    return await this.chatUsersService.addUsersToChat(+chatId, usersIds);
  }
}
