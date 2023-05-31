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
        createdAt: true,
        sender: {
          select: {
            username: true,
          },
        },
        content: true,
      },
    });

    return messages;
  }
}
