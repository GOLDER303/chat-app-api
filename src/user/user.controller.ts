import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('users')
export class UserController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getAllUsers() {
    return await this.prisma.user.findMany({
      select: { id: true, username: true },
    });
  }
}
