import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NewsletterModule } from '../newsletter/newsletter.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtTestSecret } from './entities/secret.entity';
import { ProfileModule } from '../profile/profile.module';
import { AuthRepository } from './auth.repository';
import { InMemoryDatabaseModule } from '../db/inmemory.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    NewsletterModule,
    ProfileModule,
    InMemoryDatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtTestSecret.secret,
      signOptions: {
        algorithm: 'HS256',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
