import { Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { PrismaService } from './../prisma/prisma.service';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.prisma.user.findMany({
      select: { id: true, username: true, userImageFileName: true },
    });

    const transformedUsers = users.map((user) => {
      const transformedUser: UserDTO = {
        id: user.id,
        username: user.username,
        hasProfileImage: user.userImageFileName ? true : false,
      };

      return transformedUser;
    });

    return transformedUsers;
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

  async getUserProfileImageReadStream(userId: number) {
    const userInfo = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { userImageFileName: true },
    });

    if (!userInfo.userImageFileName) {
      throw new NotFoundException(
        `User with id ${userId} does not have a profile image`,
      );
    }

    const chatImageFileName = userInfo.userImageFileName;

    const chatImagePath = join(process.cwd(), 'uploads', chatImageFileName);

    const chatImage = createReadStream(chatImagePath);

    return chatImage;
  }
}
