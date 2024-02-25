import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UsersIdsDTO {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  usersIds: number[];
}
