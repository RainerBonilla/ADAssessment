import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenDTO } from './dtos/accessToken.dto';
import { UserDTO } from '../user/dtos/user.dto';
import { Public } from '../decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() user: UserDTO): Promise<AccessTokenDTO> {
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() newUser: UserDTO): Promise<AccessTokenDTO> {
    return await this.authService.register(newUser);
  }
}
