import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserId } from 'src/common/decorators/get-user-id.decorator';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { ChatOwnerGuard } from 'src/common/guards/chat-owner.guard';
import { multerOptions } from 'src/config/multer-options';
import { ChatService } from './chat.service';
import { CreateChatRequestDTO } from './dtos/create-chat-request.dto';
import { CreateChatResponseDTO } from './dtos/create-chat-response.dto';
import { PatchChatRequestDTO } from './dtos/patch-chat-request.dto';
import { UserChatDTO } from './dtos/user-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  async createChat(
    @GetUserId() userId: string,
    @Body() createChatRequestDTO: CreateChatRequestDTO,
  ): Promise<CreateChatResponseDTO> {
    return await this.chatService.createChat(userId, createChatRequestDTO);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getUserChats(@GetUserId() userId: string): Promise<UserChatDTO[]> {
    return await this.chatService.getUserChats(userId);
  }

  @UseGuards(AccessTokenGuard, ChatOwnerGuard)
  @Delete(':chatId')
  @HttpCode(204)
  async deleteChat(@Param('chatId') chatId: string) {
    return await this.chatService.deleteChat(parseInt(chatId));
  }

  @UseGuards(AccessTokenGuard, ChatOwnerGuard)
  @Patch(':chatId')
  async patchChat(
    @Param('chatId') chatId: string,
    @Body() patchChatRequest: PatchChatRequestDTO,
  ) {
    return await this.chatService.patchChat(+chatId, patchChatRequest);
  }

  @UseGuards(AccessTokenGuard, ChatOwnerGuard)
  @Post(':chatId/image')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async addChatImage(@UploadedFile() image: Express.Multer.File) {
    console.log(image);
  }
}
