import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class NewMessageDTO {
  @IsNotEmpty()
  @IsInt()
  chatId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
