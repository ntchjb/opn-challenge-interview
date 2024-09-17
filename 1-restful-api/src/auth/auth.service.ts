import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { NewUserInfo } from './entities/signup.entity';
import { NewsletterService } from '../newsletter/newsletter.service';
import { ProfileService } from '../profile/profile.service';
import { randomUUID } from 'crypto';
import { ErrorProfileNotFound } from '../profile/entities/error.entity';
import { UserProfile } from '../profile/entities/profile.entity';
import {
  ErrorEmailAlreadyUsed,
  ErrorInvalidEmailOrPassword,
} from './entities/error.entity';
import { AuthRepository } from './auth.repository';
import { JWTToken } from './entities/jwt.entity';
import { JWTUserInfo } from './entities/header.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly newsletterService: NewsletterService,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) {}

  public async signup(info: NewUserInfo): Promise<string> {
    let existingProfile: UserProfile;
    try {
      existingProfile = await this.profileService.getByEmail(info.email);
    } catch (e) {
      if (!(e instanceof ErrorProfileNotFound)) {
        throw e;
      }
    }
    if (existingProfile) {
      throw new ErrorEmailAlreadyUsed(info.email);
    }

    const userId = randomUUID();

    const hashedPassword = await bcrypt.hash(info.password, 10);

    await this.authRepository.setEmailCredential(
      userId,
      info.email,
      hashedPassword,
    );

    await this.profileService.createNewProfile(userId, {
      address: info.address,
      dob: info.dob,
      email: info.email,
      gender: info.gender,
      name: info.name,
    });

    if (info.subscribedEnabled) {
      await this.newsletterService.subscribe(userId);
    }

    return userId;
  }

  public async signinWithEmail(
    email: string,
    password: string,
  ): Promise<JWTToken> {
    const emailCred = await this.authRepository.getEmailCredential(email);
    const isMatch = await bcrypt.compare(password, emailCred.hashedPassword);
    if (!isMatch) {
      throw new ErrorInvalidEmailOrPassword();
    }

    const payload: JWTUserInfo = {
      userId: emailCred.userId,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

  public async changeEmailCredential(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const profile = await this.profileService.getById(userId);
    const emailCred = await this.authRepository.getEmailCredential(
      profile.email,
    );

    const isMatch = await bcrypt.compare(
      currentPassword,
      emailCred.hashedPassword,
    );
    if (!isMatch) {
      throw new ErrorInvalidEmailOrPassword();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.authRepository.setEmailCredential(
      userId,
      profile.email,
      hashedPassword,
    );
  }

  public async delete(userId: string, currentPassword: string) {
    const profile = await this.profileService.getById(userId);
    const emailCred = await this.authRepository.getEmailCredential(
      profile.email,
    );

    const isMatch = await bcrypt.compare(
      currentPassword,
      emailCred.hashedPassword,
    );
    if (!isMatch) {
      throw new ErrorInvalidEmailOrPassword();
    }

    await this.authRepository.deleteEmailCredential(profile.email);
    await Promise.all([
      this.newsletterService.unsubscribe(userId),
      this.profileService.deleteProfile(userId),
    ]);
  }
}
