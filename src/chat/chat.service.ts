import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatRequestDTO } from './dtos/create-chat-request.dto';
import { CreateChatResponseDTO } from './dtos/create-chat-response.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(
    userId: string,
    createChatRequestDTO: CreateChatRequestDTO,
  ): Promise<CreateChatResponseDTO> {
    const chatUsers = createChatRequestDTO.users.concat(parseInt(userId));

    try {
      const createdChat = await this.prisma.chat.create({
        data: {
          chatName: createChatRequestDTO.chatName,
          users: {
            connect: chatUsers.map((userId) => ({ id: userId })),
          },
        },
      });

      return { chatId: createdChat.id };
    } catch (error) {
      throw new BadRequestException('You entered the wrong users ids');
    }
  }
}
