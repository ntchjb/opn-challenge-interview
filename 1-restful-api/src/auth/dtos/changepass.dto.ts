import { IsString } from 'class-validator';

export class ChangePasswordRequestDto {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}
