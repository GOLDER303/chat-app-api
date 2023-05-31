import { IsNumber } from 'class-validator';

export class GetMessagesRequestDTO {
  @IsNumber()
  chatId: number;
}
