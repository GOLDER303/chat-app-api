import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MessageModule } from 'src/message/message.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [JwtModule, MessageModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
