import { BadRequestException, NotFoundException } from '@nestjs/common';

export class ErrorProfileNotFound extends NotFoundException {
  constructor(public userId: string) {
    super('profile not found');
  }
}

export class ErrorProfileAlreadyExist extends BadRequestException {
  constructor(public userId: string) {
    super(`profile already exist`);
  }
}
