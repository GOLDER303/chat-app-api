import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PatchChatRequestDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  chatName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  usersToAddIds?: number[];
}
