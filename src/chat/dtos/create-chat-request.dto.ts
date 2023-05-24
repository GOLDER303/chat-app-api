import { ArrayMinSize, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatRequestDTO {
  @IsNotEmpty()
  @IsString()
  chatName: string;

  @ArrayMinSize(1)
  @IsInt({ each: true })
  users: number[];
}
