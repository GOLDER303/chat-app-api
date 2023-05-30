import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpRequestDTO {
  @IsEmail()
  email: string;
  @IsString()
  username: string;
  @IsNotEmpty()
  password: string;
}
