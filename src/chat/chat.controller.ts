import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUserId } from 'src/common/decorators/get-user-id.decorator';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatRequestDTO } from './dtos/create-chat-request.dto';
import { CreateChatResponseDTO } from './dtos/create-chat-response.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  async createChat(
    @GetUserId() userId: string,
    @Body() createChatRequestDTO: CreateChatRequestDTO,
  ): Promise<CreateChatResponseDTO> {
    const chatUsers = createChatRequestDTO.users.concat(parseInt(userId));

    const createdChat = await this.prisma.chat.create({
      data: {
        chatName: createChatRequestDTO.chatName,
        users: {
          connect: chatUsers.map((userId) => ({ id: userId })),
        },
      },
    });

    return { chatId: createdChat.id };
  }
}
