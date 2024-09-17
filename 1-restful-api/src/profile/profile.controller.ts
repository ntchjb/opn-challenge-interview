import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  EditProfileRequestDto,
  GetProfileResponseDto,
} from './dtos/profile.dto';
import { AuthRequest } from '../auth/entities/header.entity';
import { NewsletterService } from '../newsletter/newsletter.service';

@Controller('api/v1/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly newsletterService: NewsletterService,
  ) {}

  @Get('')
  public async getUserProfile(
    @Request() req: AuthRequest,
  ): Promise<GetProfileResponseDto> {
    const profile = await this.profileService.getById(req.user.userId);
    const subscribeEnabled = await this.newsletterService.isSubscribing(
      req.user.userId,
    );

    return {
      address: profile.address,
      age: new Date(Date.now() - profile.dob.getTime()).getUTCFullYear() - 1970,
      email: profile.email,
      gender: profile.gender,
      name: profile.name,
      subscribeEnabled,
    };
  }

  @Patch('')
  public async editUserProfile(
    @Request() req: AuthRequest,
    @Body() userInfo: EditProfileRequestDto,
  ): Promise<void> {
    await this.profileService.updateProfile(req.user.userId, {
      address: userInfo.address,
      dob: userInfo.dob,
      gender: userInfo.gender,
    });

    if (userInfo.subscribeEnabled !== undefined) {
      if (userInfo.subscribeEnabled) {
        await this.newsletterService.subscribe(req.user.userId);
      } else {
        await this.newsletterService.unsubscribe(req.user.userId);
      }
    }
  }
}
