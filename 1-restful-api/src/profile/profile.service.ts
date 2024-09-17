import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { EditableUserProfile, UserProfile } from './entities/profile.entity';
import { ErrorProfileNotFound } from './entities/error.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  public async getById(userId: string): Promise<UserProfile> {
    const profile = this.profileRepository.findById(userId);
    if (!profile) {
      throw new ErrorProfileNotFound(userId);
    }

    return profile;
  }

  public async getByEmail(email: string): Promise<UserProfile> {
    const profile = this.profileRepository.findByEmail(email);
    if (!profile) {
      throw new ErrorProfileNotFound(email);
    }

    return profile;
  }

  public async createNewProfile(
    userId: string,
    info: UserProfile,
  ): Promise<void> {
    return this.profileRepository.create(userId, info);
  }

  public async updateProfile(userId: string, info: EditableUserProfile) {
    const profile = this.profileRepository.findById(userId);
    this.profileRepository.update(userId, {
      ...profile,
      ...info,
    });
  }

  public async deleteProfile(userId: string): Promise<void> {
    return this.profileRepository.delete(userId);
  }
}
