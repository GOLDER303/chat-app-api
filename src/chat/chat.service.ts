import { BadRequestException, Injectable } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatRequestDTO } from './dtos/create-chat-request.dto';
import { CreateChatResponseDTO } from './dtos/create-chat-response.dto';
import { PatchChatRequestDTO } from './dtos/patch-chat-request.dto';
import { UserChatDTO } from './dtos/user-chat.dto';

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

  async getUserChats(userId: string): Promise<UserChatDTO[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            id: parseInt(userId),
          },
        },
      },
      select: {
        id: true,
        chatName: true,
        messages: {
          select: {
            sender: {
              select: {
                username: true,
              },
            },
            content: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        users: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    const transformedChats = chats.map((chat) => {
      const lastMessage = chat.messages[0];
      return {
        id: chat.id,
        chatName: chat.chatName,
        lastMessage,
        users: chat.users,
      };
    });

    return transformedChats;
  }

  async getChat(chatId: number): Promise<Chat & { users: { id: number }[] }> {
    try {
      return await this.prisma.chat.findUniqueOrThrow({
        where: { id: chatId },
        include: {
          users: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(`Chat with id: ${chatId} does not exist`);
    }
  }

  async deleteChat(chatId: number) {
    try {
      await this.prisma.chat.delete({ where: { id: chatId } });
    } catch (error) {
      throw new BadRequestException(`Chat with id: ${chatId} does not exist`);
    }
  }

  async patchChat(chatId: number, patchChatRequest: PatchChatRequestDTO) {
    const usersToAdd = patchChatRequest.usersToAddIds
      ? patchChatRequest.usersToAddIds.map((userToAddId) => ({
          id: userToAddId,
        }))
      : undefined;

    try {
      return await this.prisma.chat.update({
        where: { id: chatId },
        data: {
          chatName: patchChatRequest.chatName,
          users: {
            connect: usersToAdd,
          },
        },
        select: {
          id: true,
          chatName: true,
          users: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(`Chat with id: ${chatId} does not exist`);
    }
  }
}
