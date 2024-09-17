import { Injectable } from '@nestjs/common';
import { InmemoryDatabase } from '../db/inmemory.db';
import { UserProfile } from './entities/profile.entity';
import { ErrorProfileAlreadyExist } from './entities/error.entity';

@Injectable()
export class ProfileRepository {
  private readonly profileKey = `profile`;
  constructor(private readonly db: InmemoryDatabase) {}

  public findById(userId: string): UserProfile {
    return this.db.get(`${this.profileKey}:id:${userId}`);
  }

  public findByEmail(email: string): UserProfile {
    return this.db.get(`${this.profileKey}:email:${email}`);
  }

  public update(userId: string, info: UserProfile) {
    this.db.set(`${this.profileKey}:id:${userId}`, info);
    this.db.set(`${this.profileKey}:email:${info.email}`, info);
  }

  public create(userId: string, info: UserProfile) {
    const profile = this.findById(userId);
    if (profile) {
      throw new ErrorProfileAlreadyExist(userId);
    }

    this.update(userId, info);
  }

  public delete(userId: string) {
    const profile = this.findById(userId);
    if (!profile) {
      return;
    }

    this.db.delete(`${this.profileKey}:id:${userId}`);
    this.db.delete(`${this.profileKey}:email:${profile.email}`);
  }
}
