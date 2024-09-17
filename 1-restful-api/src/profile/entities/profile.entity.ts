export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type UserProfile = {
  email: string;
  name: string;
  dob: Date;
  gender: Gender;
  address: string;
};

export type EditableUserProfile = Omit<UserProfile, 'email' | 'name'>;
