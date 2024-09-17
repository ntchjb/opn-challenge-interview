import { IsString } from 'class-validator';

export class DeleteAccountRequestDto {
  @IsString()
  currentPassword: string;
}
