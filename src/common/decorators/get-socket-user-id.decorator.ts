import { Socket } from 'socket.io';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetSocketUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const socket = ctx.switchToWs().getClient<Socket>();
    return socket.data['userId'];
  },
);
