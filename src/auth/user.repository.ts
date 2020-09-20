import { Repository, EntityRepository } from "typeorm"
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./auth-credentials-dto";
import { ConflictException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';


@EntityRepository(User)
export class UserRepository extends Repository<User>{
  async signUp(credentialsDto:AuthCredentialsDto): Promise<void>{
    const { username, password } = credentialsDto;
    // const res = await this.findOne({username});
    
    // if (res) {
    //   throw new BadRequestException("User already exists")

    // }
    const salt = await bcrypt.genSalt()
    const user = new User();
    // console.log(salt)

    user.username = username;
    user.password = await this.hashPassword(password, salt);
    user.salt = salt;

    try {
      await user.save();

    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException("User already exists")
      }
      else {
        throw new InternalServerErrorException();
      }
    }
    
    
  }
  async login(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (!user) {
      throw new UnauthorizedException("Incorrect credentials");
    }
    const newHash = await this.hashPassword(password, user.salt)
    if (user.password !== newHash) {
      throw new UnauthorizedException("Incorrect credentials");
    }
    return username;
    

  }

  private async hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }




}