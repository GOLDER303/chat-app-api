import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { ChatOwnerGuard } from 'src/common/guards/chat-owner.guard';
import { UserIdMatchJwtGuard } from 'src/common/guards/user-id-match-jwt.guard';
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

  @Delete('/:userId')
  @UseGuards(UserIdMatchJwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async leaveChat(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    await this.chatUsersService.deleteUserFromChat(+chatId, +userId);
  }
}
