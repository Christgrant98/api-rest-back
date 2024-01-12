import { HttpException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hash, compare } from 'bcrypt';
import { AuthDocument, Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<AuthDocument>,
    private jwtService: JwtService,
  ) {}

  async register(userObject: RegisterAuthDto) {
    const { password, email } = userObject;
    const plainToHash = await hash(password, 10);
    userObject = { ...userObject, password: plainToHash };
    console.log('userObject', userObject);
    console.log('userObject', userObject.email);
    await this.authModel.create(userObject);
    const findUser = await this.authModel.findOne({ email });
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 500);
    const payload = { id: findUser._id, name: findUser.username };
    const token = this.jwtService.sign(payload);
    console.log('findUser', token);
    const data = {
      user: findUser,
      token,
    };
    console.log('findUser', data);
    return data;
  }

  async login(userObjectLogin: LoginAuthDto) {
    const { email, password } = userObjectLogin;
    const findUser = await this.authModel.findOne({ email });
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);

    const checkPassword = await compare(password, findUser.password);
    console.log('checkPassword => ', checkPassword);
    
    if (!checkPassword) throw new HttpException('Wrong email or password', 403);

    const payload = { id: findUser._id, name: findUser.username };
    const token = this.jwtService.sign(payload);

    const data = {
      user: findUser,
      token,
    };

    return data;
  }
}
