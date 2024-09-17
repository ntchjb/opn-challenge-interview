import { Injectable } from '@nestjs/common';
import { InmemoryDatabase } from '../db/inmemory.db';
import { EmailCredential } from './entities/credential.entity';

@Injectable()
export class AuthRepository {
  private readonly authKey = `auth`;
  constructor(private readonly db: InmemoryDatabase) {}

  public async setEmailCredential(
    userId: string,
    email: string,
    hashedPassword: string,
  ): Promise<void> {
    this.db.set<EmailCredential>(`${this.authKey}:email:${email}`, {
      hashedPassword,
      userId,
    });
  }

  public async getEmailCredential(email: string): Promise<EmailCredential> {
    return this.db.get(`${this.authKey}:email:${email}`);
  }

  public async deleteEmailCredential(email: string): Promise<void> {
    return this.db.delete(`${this.authKey}:email:${email}`);
  }
}
