import { Body, Controller, Get, JsonController, Param, Post, Res, UseBefore } from 'routing-controllers';
import 'reflect-metadata';
import { authMiddleware } from '../middlewares/index.js';
import { BodyT, BodyUserT, LoginBodyT } from '../model/modelUser.js';
import User from '../models/mapping.js';
import config from 'config';
import APIError from '../errors/APIError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const maxAge = 60 * 60 * 1000 * 24;

function generateJwt({ id, email, login }: Pick<BodyT, 'email' | 'login' | 'id'>) {
  return jwt.sign({ id, email, login }, config.get('secretKey') as string, {
    expiresIn: '24h',
  });
}

@Controller()
@JsonController()
export class UserController {
  @UseBefore(authMiddleware)
  @Get('/user/check')
  async check(@UseBefore() id: string, @Res() res: any) {
    const user: any = await User.findOne({ where: { id } });
    if (user) {
      res.cookie('user', user.id, {
        maxAge,
        signed: true,
        sameSite: 'Strict',
        secure: true,
      });
      const token = generateJwt({ id: user.id, login: user.login, email: user.email });
      return { token, user, message: 'Ok' };
    } else {
      return { message: 'Не авторизован' };
    }
  }

  @Post('/user/login')
  async login(@Body() { password, email }: LoginBodyT, @Res() res: any) {
    try {
      let user: any = await User.findOne({ where: { email } });
      const number = await User.findOne({
        where: { number: email },
      });

      if (!user && !number) {
        throw APIError.badRequest('логин или email не найден');
      } else if (number) {
        user = number;
      }
      const comparePass = bcrypt.compareSync(password, user.password);
      if (!comparePass) {
        throw APIError.badRequest('неверный пароль');
      }
      const token = generateJwt({ id: user.id, login: user.login, email: user.email });
      res.cookie('diskId', user.id, {
        maxAge,
        signed: true,
        sameSite: 'Strict',
        secure: true,
      });
      return res.json({ message: 'Ok', token, user });
    } catch (e) {
      if (e instanceof Error) throw APIError.badRequest(e.message);
    }
  }

  @Post('/user/add')
  async registration(@Body() { login, number, email, password, role }: BodyUserT, @Res() res: any) {
    try {
      const candidata = await User.findOne({ where: { email } });
      if (candidata) {
        throw APIError.badRequest('Данный email уже существует');
      }
      const userNumber = await User.findOne({ where: { number } });
      if (userNumber) {
        throw APIError.badRequest('Данный номер уже существует');
      }
      const userLogin = await User.findOne({ where: { login } });
      if (userLogin) {
        throw APIError.badRequest('Данный логин уже существует');
      }

      const hashPass = await bcrypt.hash(password, 5);
      const user: any = await User.create({
        password: hashPass,
        email,
        role,
        number,
        login,
      });

      const token = generateJwt({ id: user.id, login: user.login, email: user.email });
      res.cookie('user', user.id, {
        maxAge,
        signed: true,
        sameSite: 'Strict',
        secure: true,
      });
      return { message: 'Ok', token, user };
    } catch (e) {
      if (e instanceof Error) throw APIError.badRequest(e.message);
    }
  }
}
