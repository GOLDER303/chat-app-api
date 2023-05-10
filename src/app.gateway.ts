import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class AppGateway {
  @WebSocketServer()
  wss: Server;

  @SubscribeMessage('msgToServer')
  handleMessage(client: any, text: any) {
    this.wss.emit('msgToClient', text);
  }
}
