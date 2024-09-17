import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from '../entities/profile.entity';
import { Type } from 'class-transformer';

export type GetProfileResponseDto = {
  email: string;
  name: string;
  age: number;
  gender: Gender;
  address: string;
  subscribeEnabled: boolean;
};

export class EditProfileRequestDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dob?: Date;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  subscribeEnabled?: boolean;
}
