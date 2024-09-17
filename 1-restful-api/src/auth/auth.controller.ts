import { Body, Controller, Post, Request } from '@nestjs/common';
import { SignUpRequestDto, SignUpResponseDto } from './dtos/signup.dto';
import { AuthService } from './auth.service';
import { SignInRequestDto, SignInResponseDto } from './dtos/signin.dto';
import { ChangePasswordRequestDto } from './dtos/changepass.dto';
import { Public } from './public.metadata';
import { AuthRequest } from './entities/header.entity';
import { DeleteAccountRequestDto } from './dtos/delete.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  public async signup(
    @Body() req: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    const userId = await this.authService.signup({
      address: req.address,
      dob: req.dob,
      email: req.email,
      gender: req.gender,
      name: req.name,
      password: req.password,
      subscribedEnabled: req.subscribeEnabled,
    });

    return {
      id: userId,
    };
  }

  @Post('signin')
  @Public()
  public async signin(
    @Body() req: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signinWithEmail(req.email, req.password);
  }

  @Post('change-credential')
  public async changePassword(
    @Request() authReq: AuthRequest,
    @Body() req: ChangePasswordRequestDto,
  ) {
    return this.authService.changeEmailCredential(
      authReq.user.userId,
      req.currentPassword,
      req.newPassword,
    );
  }

  @Post('delete')
  public async deleteAccount(
    @Request() authReq: AuthRequest,
    @Body() req: DeleteAccountRequestDto,
  ) {
    return this.authService.delete(authReq.user.userId, req.currentPassword);
  }
}
