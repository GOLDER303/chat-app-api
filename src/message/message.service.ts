import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';
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
        seenByUsers: {
          select: {
            id: true,
          },
        },
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
        seenByUsers: { connect: { id: senderId } },
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
        seenByUsers: {
          select: { id: true },
        },
        content: true,
      },
    });
  }

  async messageSeen(messageId: number, seerId: number): Promise<Message> {
    return await this.prisma.message.update({
      where: { id: messageId },
      data: { seenByUsers: { connect: { id: seerId } } },
    });
  }
}
