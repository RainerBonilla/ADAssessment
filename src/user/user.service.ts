import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CheckUserDTO } from './dtos/checkUser.dto';
import { UserDTO } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(user: CheckUserDTO): Promise<User | undefined> {
    try {
      const gotUser = await this.userModel
        .findOne({
          email: user.email,
        })
        .exec();
      if (!gotUser) return undefined;
      return gotUser;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('something happened');
    }
  }

  async insertOne(user: UserDTO): Promise<boolean> {
    try {
      const newUser = await this.userModel.insertOne(user);
      if (!newUser) return false;
      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('something happened');
    }
  }
}
