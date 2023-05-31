import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const chatId = parseInt(request.body.chatId);
    const userId = request.user['userId'];

    const user = await this.prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        chats: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user.chats.some((chat) => chat.id == chatId)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
