import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import UserService from './user.service';
import User from './user.entity';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH_SECRET,
    });
  }

  async validate(payload: {
    id: User['id'];
    email: string;
    access_level: number;
  }) {
    const user = await this.userService.findById(payload.id);

    return user;
  }
}
