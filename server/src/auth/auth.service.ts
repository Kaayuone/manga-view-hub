import * as argon2 from 'argon2';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { TokenPayload, TokensResponse } from './types';
import { COMMON } from '@/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.findOne(undefined, username);
      if (user && argon2.verify(user.password, password)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async login(user: User): Promise<TokensResponse> {
    const payload: TokenPayload = { username: user.username, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${COMMON.REFRESH_TOKEN_EXPIRATION_DAYS}d`,
    });
    await this.usersService.addRefreshToken(user.id, refreshToken);
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokensResponse> {
    try {
      const payload: TokenPayload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub, undefined, true);
      if (!user) {
        throw new UnauthorizedException();
      }

      const tokenExists = user.refreshToken.some(
        token => token.token === refreshToken && token.expiresAt > new Date(),
      );
      if (!tokenExists) {
        throw new UnauthorizedException();
      }

      const newPayload: TokenPayload = { username: user.username, sub: user.id };
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: `${COMMON.REFRESH_TOKEN_EXPIRATION_DAYS}d`,
      });

      await this.usersService.removeRefreshToken(user.id, refreshToken);
      await this.usersService.addRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async logout(userId: number, refreshToken: string) {
    await this.usersService.removeRefreshToken(userId, refreshToken);
  }
}
