import { Injectable } from '@nestjs/common';
import { InmemoryDatabase } from '../db/inmemory.db';

@Injectable()
export class NewsletterRepository {
  private readonly newsletterKey = 'newsletter';
  constructor(private readonly db: InmemoryDatabase) {}

  public addSubscriber(userId: string) {
    this.db.set(`${this.newsletterKey}:${userId}`, true);
  }

  public removeSubscriber(userId: string) {
    this.db.delete(`${this.newsletterKey}:${userId}`);
  }

  public isSubscriberExist(userId: string): boolean {
    const sub = this.db.get<boolean>(`${this.newsletterKey}:${userId}`);
    return sub ?? false;
  }
}
