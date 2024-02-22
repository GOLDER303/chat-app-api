import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { ChatService } from './chat.service';
import { NewMessageDTO } from './dtos/new-message.dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  wss: Server;

  handleConnection(client: Socket) {
    try {
      const authToken = client.handshake.headers['authorization'].split(' ')[1];
      const jwtPayload = this.jwtService.verify(authToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      const userId = jwtPayload.sub.toString();

      client.data.userId = userId;

      client.join(userId);
      console.log(`User ${userId} setup`);

      client.emit('connected');
    } catch (error) {
      client.disconnect();
      console.error(`Client ${client.id} not authorized`);
      client.emit('notAuthorized');
    }
  }

  @SubscribeMessage('createNewMessage')
  async handleNewMessage(client: Socket, { chatId, content }: NewMessageDTO) {
    const senderId: string = client.data['userId'];

    const chat = await this.chatService.getChat(chatId);

    const newMessage = await this.messageService.createNewMessage(
      chat.id,
      parseInt(senderId),
      content,
    );

    chat.users.forEach((user) => {
      this.wss.to(user.id.toString()).emit('newMessage', {
        senderId: newMessage.senderId,
        message: newMessage.content,
      });
    });
  }
}
