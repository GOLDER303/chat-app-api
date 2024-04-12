import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { multerOptions } from 'src/config/multer-options';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getAllUsers(): Promise<UserDTO[]> {
    return await this.userService.getAllUsers();
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:userId/image')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadUserImage(
    @Param('userId') userId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('You have to provide an image');
    }

    await this.userService.addUserImage(+userId, image);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':userId/image')
  async getUserProfileImage(@Param('userId') userId: string) {
    const chatImageReadableStream =
      await this.userService.getUserProfileImageReadStream(+userId);

    return new StreamableFile(chatImageReadableStream);
  }
}
