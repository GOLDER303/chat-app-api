import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GetSocketUserId } from 'src/common/decorators/get-socket-user-id.decorator';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly jwtService: JwtService) {}

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
  handleNewMessage(client: Socket, { recipientId, message }: NewMessageDTO) {
    const senderId = client.data['userId'];
    this.wss
      .to(recipientId)
      .to(senderId)
      .emit('newMessage', { senderId, message });
  }
}
