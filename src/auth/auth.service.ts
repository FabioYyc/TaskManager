import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './auth-credentials-dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger("AuthService");



  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService:JwtService
  ){}
  async signUp(credentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(credentialsDto);
  }

  async login(credentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }>{
    const username = await this.userRepository.login(credentialsDto);
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`)

    return { accessToken };

  }

}
