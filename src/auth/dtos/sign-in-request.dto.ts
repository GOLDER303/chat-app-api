import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInRequestDTO {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
