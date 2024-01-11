import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  handleRegister(@Body() registerBody: RegisterAuthDto) {
    try {
      return this.authService.register(registerBody);
    } catch (error) {
      console.log('Error en Registar usuario', error);
    }
  }

  @Post('login')
  handleLogin2(@Body() loginBody: LoginAuthDto) {
    console.log('loginBody into controller=', loginBody);
    try {
      return this.authService.login(loginBody);
    } catch (error) {
      console.error('something went wrong dude', error);
    }
  }
}
