import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';

@Module({
  imports: [JwtModule],
  providers: [ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
