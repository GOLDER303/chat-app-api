import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from './../prisma/prisma.service';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<UserDTO[]> {
    return await this.prisma.user.findMany({
      select: { id: true, username: true },
    });
  }

  async checkNonExistingUsers(userIds: number[]): Promise<number[]> {
    const existingUsers = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
      },
    });

    const existingUserIds = new Set<number>();

    existingUsers.forEach((user) => {
      existingUserIds.add(user.id);
    });

    return userIds.filter((userId) => !existingUserIds.has(userId));
  }

  async addUserImage(userId: number, image: Express.Multer.File) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });

      const prevUserImageFileName = user.userImageFileName;

      if (prevUserImageFileName) {
        const prevChatImageFilePath = join('uploads', prevUserImageFileName);

        if (existsSync(prevChatImageFilePath)) {
          unlinkSync(prevChatImageFilePath);
        }
      }

      return await this.prisma.chat.update({
        where: { id: userId },
        data: {
          chatImageFileName: image.filename,
        },
      });
    } catch (error) {
      console.error(error);
      throw new NotFoundException(`User with id: ${userId} does not exist`);
    }
  }
}
