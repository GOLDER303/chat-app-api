import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchChatRequestDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  chatName?: string;
}
