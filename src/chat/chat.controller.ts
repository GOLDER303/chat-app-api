import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUserId } from 'src/common/decorators/get-user-id.decorator';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { ChatService } from './chat.service';
import { CreateChatRequestDTO } from './dtos/create-chat-request.dto';
import { CreateChatResponseDTO } from './dtos/create-chat-response.dto';
import { UserChatDTO } from './dtos/user-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  async createChat(
    @GetUserId() userId: string,
    @Body() createChatRequestDTO: CreateChatRequestDTO,
  ): Promise<CreateChatResponseDTO> {
    return await this.chatService.createChat(userId, createChatRequestDTO);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getUserChats(@GetUserId() userId: string): Promise<UserChatDTO[]> {
    return await this.chatService.getUserChats(userId);
  }
}
