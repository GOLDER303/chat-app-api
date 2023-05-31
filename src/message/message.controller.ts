import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { ChatOwnerGuard } from 'src/common/guards/chat-owner.guard';
import { GetMessagesRequestDTO } from './dtos/get-messages-request.dto';
import { MessageResponseDTO } from './dtos/message-response.dto';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AccessTokenGuard, ChatOwnerGuard)
  @Get('/')
  async getChatMesseges(
    @Body() getMessagesRequestDTO: GetMessagesRequestDTO,
  ): Promise<MessageResponseDTO[]> {
    return await this.messageService.getChatMessages(
      getMessagesRequestDTO.chatId,
    );
  }
}
