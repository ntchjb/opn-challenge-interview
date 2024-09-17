import { Injectable } from '@nestjs/common';
import { NewsletterRepository } from './newsletter.repository';

@Injectable()
export class NewsletterService {
  constructor(private readonly newsletterRepository: NewsletterRepository) {}

  public async subscribe(userId: string) {
    return this.newsletterRepository.addSubscriber(userId);
  }

  public async unsubscribe(userId: string) {
    return this.newsletterRepository.removeSubscriber(userId);
  }

  public async isSubscribing(userId: string): Promise<boolean> {
    return this.newsletterRepository.isSubscriberExist(userId);
  }
}
