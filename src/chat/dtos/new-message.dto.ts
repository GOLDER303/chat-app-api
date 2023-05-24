import { IsNotEmpty, IsString } from 'class-validator';

export class NewMessageDTO {
  @IsNotEmpty()
  @IsString()
  recipientId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
