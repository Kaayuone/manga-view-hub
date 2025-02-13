import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
