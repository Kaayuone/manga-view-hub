import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { COMMON } from '@/constants';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await argon2.hash(createUserDto.password);
    // TODO: return login data (tokens)
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hash,
      },
    });
  }

  findOne(id?: number, username?: string, includeTokens?: boolean) {
    if (!id && !username) throw new Error('no filter data provided');

    return this.prisma.user.findUnique({
      where: {
        ...(id && { id }),
        ...(username && { username }),
      },
      include: {
        refreshToken: includeTokens,
      },
    });
  }

  async addRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const expiresAt = new Date(Date.now() + COMMON.REFRESH_TOKEN_EXPIRATION_MS);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: {
          create: {
            token: refreshToken,
            expiresAt,
          },
        },
      },
    });
  }

  async removeRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
        refreshToken: {
          some: {
            token: refreshToken,
          },
        },
      },
      data: {
        refreshToken: {
          deleteMany: {
            token: refreshToken,
          },
        },
      },
    });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
