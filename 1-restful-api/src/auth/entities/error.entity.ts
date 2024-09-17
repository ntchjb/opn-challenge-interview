import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class ErrorEmailAlreadyUsed extends BadRequestException {
  constructor(public email: string) {
    super('email already used');
  }
}

export class ErrorInvalidEmailOrPassword extends UnauthorizedException {
  constructor() {
    super('invalid email or password');
  }
}
