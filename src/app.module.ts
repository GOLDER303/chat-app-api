import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatUsersModule } from './chat-user/chat-users.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
    MessageModule,
    UserModule,
    ChatUsersModule,
  ],
})
export class AppModule {}
