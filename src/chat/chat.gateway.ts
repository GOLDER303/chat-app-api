import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Chat } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { GetSocketUserId } from 'src/common/decorators/get-socket-user-id.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewMessageDTO } from './dtos/new-message.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @WebSocketServer()
  wss: Server;

  handleConnection(client: Socket) {
    try {
      const authToken = client.handshake.headers['authorization'].split(' ')[1];
      const jwtPayload = this.jwtService.verify(authToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      client.data.userId = jwtPayload.sub.toString();
      client.emit('connected');
    } catch (error) {
      client.disconnect();
      console.error(`Client ${client.id} not authorized`);
      client.emit('notAuthorized');
    }
  }

  @SubscribeMessage('setup')
  handleSetup(
    @ConnectedSocket() client: Socket,
    @GetSocketUserId() userId: number,
  ) {
    console.log(`User ${userId} setup`);
    client.join(userId.toString());
  }

  @SubscribeMessage('createNewMessage')
  async handleNewMessage(client: Socket, { chatId, message }: NewMessageDTO) {
    const senderId = client.data['userId'];

    let chat: Chat & { users: { id: number }[] };

    try {
      chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          users: {
            select: {
              id: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(`Chat with id: ${chatId} does not exist`);
    }

    chat.users.forEach((user) => {
      this.wss.to(user.id.toString()).emit('newMessage', { senderId, message });
    });
  }
}
