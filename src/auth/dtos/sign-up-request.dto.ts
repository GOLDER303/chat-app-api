import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpRequestDTO {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
