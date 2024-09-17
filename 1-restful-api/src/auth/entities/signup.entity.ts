import { Gender } from '../../profile/entities/profile.entity';

export type NewUserInfo = {
  email: string;
  password: string;
  name: string;
  dob: Date;
  gender: Gender;
  address: string;
  subscribedEnabled: boolean;
};
