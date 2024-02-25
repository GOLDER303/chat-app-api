import { Injectable } from '@nestjs/common';
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
}
