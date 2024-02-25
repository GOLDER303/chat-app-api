import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { ChatUsersController } from './chat-users.controller';
import { ChatUsersService } from './chat-users.service';

@Module({
  controllers: [ChatUsersController],
  providers: [ChatUsersService],
  imports: [UserModule],
})
export class ChatUsersModule {}
