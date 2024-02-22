import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageResponseDTO } from './dtos/message-response.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async getChatMessages(chatId: number): Promise<MessageResponseDTO[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId,
      },
      select: {
        id: true,
        chatId: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        content: true,
      },
    });

    return messages;
  }

  async createNewMessage(
    chatId: number,
    senderId: number,
    message: string,
  ): Promise<MessageResponseDTO> {
    return await this.prisma.message.create({
      data: {
        chatId: chatId,
        content: message,
        senderId: senderId,
      },
      select: {
        id: true,
        chatId: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
        content: true,
      },
    });
  }
}
