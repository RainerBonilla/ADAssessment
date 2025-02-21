import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../user/dtos/user.dto';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { AccessTokenDTO } from './dtos/accessToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validate(user: UserDTO): Promise<User> {
    try {
      const gotUser = await this.usersService.findOne(user);
      if (!gotUser) throw new NotFoundException('user not found');

      const matched = bcrypt.compareSync(user.password, gotUser.password);
      if (!matched) throw new BadRequestException('incorrect credentials');

      return gotUser;
    } catch (error) {
      throw error;
    }
  }

  async login(user: UserDTO): Promise<AccessTokenDTO> {
    const payload = { email: user.email };

    return { accessToken: this.jwtService.sign(payload) };
  }

  async register(user: UserDTO): Promise<AccessTokenDTO> {
    const gotUser = await this.usersService.findOne(user);
    if (gotUser) throw new BadRequestException('user already exists');

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, password: hashedPassword };
    const res = await this.usersService.insertOne(newUser);
    if (!res)
      throw new InternalServerErrorException(
        'something happened while creating your user',
      );

    return this.login(newUser);
  }
}
