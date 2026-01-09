
import { Controller, Get, Post, Body } from '@nestjs/common';

export class UserDto {
  name: string;
  age: number;
}

@Controller('users')
export class UsersController {
  @Get('/')
  findAll(): string {
    return 'This action returns all users';
  }

  @Post('/')
  create(@Body() user: UserDto) {
    return 'This action adds a new user';
  }
}
