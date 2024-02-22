import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { ChatOwnerGuard } from 'src/common/guards/chat-owner.guard';
import { MessageResponseDTO } from './dtos/message-response.dto';
import { MessageService } from './message.service';

@Controller('chats/:chatId/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AccessTokenGuard, ChatOwnerGuard)
  @Get('/')
  async getChatMessages(
    @Param('chatId') chatId: string,
  ): Promise<MessageResponseDTO[]> {
    return await this.messageService.getChatMessages(+chatId);
  }
}
