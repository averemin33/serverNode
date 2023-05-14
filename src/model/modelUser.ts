import { IsDefined, IsEmail } from 'class-validator';

export class BodyUserT {
  @IsDefined()
  number: string;
  @IsEmail()
  email: string;
  @IsDefined()
  login: string;
  @IsDefined()
  password: string;
  @IsDefined()
  role: string;
}

export class LoginBodyT {
  @IsEmail()
  email: string;
  @IsDefined()
  password: string;
}

export type BodyT = {
  id: number;
  number: string;
  email: string;
  login: string;
  password: string;
  role?: string;
};
