import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { NewsletterModule } from '../newsletter/newsletter.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { InMemoryDatabaseModule } from '../db/inmemory.module';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [NewsletterModule, InMemoryDatabaseModule],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    ProfileRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
