import { IsEmail, IsString, IsDate, IsEnum, IsBoolean } from 'class-validator';
import { Gender } from '../../profile/entities/profile.entity';
import { Type } from 'class-transformer';

export class SignUpRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @Type(() => Date)
  @IsDate()
  dob: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  address: string;

  @IsBoolean()
  subscribeEnabled: boolean;
}

export type SignUpResponseDto = {
  id: string;
};
