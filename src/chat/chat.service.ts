import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Chat } from '@prisma/client';
import { ReadStream, createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
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
      console.error(error);
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
        chatImageFileName: true,
        messages: {
          select: {
            id: true,
            sender: {
              select: {
                username: true,
              },
            },
            content: true,
            seenByUsers: { select: { id: true } },
            createdAt: true,
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

      const transformedChat: UserChatDTO = {
        id: chat.id,
        chatName: chat.chatName,
        hasChatImage: chat.chatImageFileName ? true : false,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              sender: lastMessage.sender,
              content: lastMessage.content,
              seen: lastMessage.seenByUsers.some((user) => user.id === +userId),
              createdAt: lastMessage.createdAt,
            }
          : undefined,
        users: chat.users,
      };

      return transformedChat;
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
      console.error(error);
      throw new BadRequestException(`Chat with id: ${chatId} does not exist`);
    }
  }

  async deleteChat(chatId: number) {
    try {
      await this.prisma.chat.delete({ where: { id: chatId } });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`Chat with id: ${chatId} does not exist`);
    }
  }

  async patchChat(chatId: number, patchChatRequest: PatchChatRequestDTO) {
    try {
      return await this.prisma.chat.update({
        where: { id: chatId },
        data: {
          chatName: patchChatRequest.chatName,
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
      console.error(error);
      throw new BadRequestException(`Chat with id: ${chatId} does not exist`);
    }
  }

  async addChatImage(chatId: number, image: Express.Multer.File) {
    try {
      const chat = await this.prisma.chat.findUniqueOrThrow({
        where: { id: chatId },
      });

      const prevChatImageFileName = chat.chatImageFileName;

      if (prevChatImageFileName) {
        const prevChatImageFilePath = join('uploads', prevChatImageFileName);

        if (existsSync(prevChatImageFilePath)) {
          console.log(`removing ${prevChatImageFilePath}`);
          unlinkSync(prevChatImageFilePath);
        }
      }

      return await this.prisma.chat.update({
        where: { id: chatId },
        data: {
          chatImageFileName: image.filename,
        },
      });
    } catch (error) {
      console.error(error);
      throw new NotFoundException(`Chat with id: ${chatId} does not exist`);
    }
  }

  async getChatImageReadStream(chatId: number): Promise<ReadStream> {
    const chatInfo = await this.prisma.chat.findUnique({
      where: { id: chatId },
      select: { chatImageFileName: true },
    });

    if (!chatInfo.chatImageFileName) {
      throw new NotFoundException(
        `Chat with id ${chatId} does not have an image`,
      );
    }

    const chatImageFileName = chatInfo.chatImageFileName;

    const chatImagePath = join(process.cwd(), 'uploads', chatImageFileName);

    const chatImage = createReadStream(chatImagePath);

    return chatImage;
  }
}
