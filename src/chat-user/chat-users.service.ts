import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { UsersIdsDTO } from './dto/user-ids.dto';

@Injectable()
export class ChatUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async addUsersToChat(chatId: number, usersToAddIds: UsersIdsDTO) {
    const usersToAdd = usersToAddIds.usersIds.map((userToAddId) => ({
      id: userToAddId,
    }));

    const nonExistentUsers = await this.userService.checkNonExistingUsers(
      usersToAdd.map((userToAdd) => userToAdd.id),
    );

    if (nonExistentUsers.length == 1) {
      throw new NotFoundException(
        `User with id: ${nonExistentUsers} does not exist`,
      );
    } else if (nonExistentUsers.length > 1) {
      throw new NotFoundException(
        `Users with ids: ${nonExistentUsers} do not exist`,
      );
    }

    try {
      return await this.prisma.chat.update({
        where: { id: chatId },
        data: {
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
      console.error(error);
      throw new BadRequestException(`Chat with id: ${chatId} does not exist`);
    }
  }
}
