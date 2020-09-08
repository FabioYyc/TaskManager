import { Controller, Post, Body, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './auth-credentials-dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {

  constructor(
    private authService:AuthService

  ) {}

  @Post("/signup")
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCredentialsDto);

  }
  @Post("/login")
  login(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{accessToken:string}> {
    return this.authService.login(authCredentialsDto);

  }
  
  @Post("/test")
  @UseGuards(AuthGuard())
  test(@GetUser() user) {
    // console.log(req)
    console.log(user)
  }

}
