import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { InMemoryDatabaseModule } from '../db/inmemory.module';
import { NewsletterRepository } from './newsletter.repository';

@Module({
  imports: [InMemoryDatabaseModule],
  providers: [NewsletterService, NewsletterRepository],
  exports: [NewsletterService],
})
export class NewsletterModule {}
