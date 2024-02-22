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
}
