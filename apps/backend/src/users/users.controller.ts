import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput, UpdateUserInput, User, UserFilters } from '@falconi/shared-types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('profileId') profileId?: string): User[] {
    const filters: UserFilters = profileId ? { profileId } : {};
    return this.usersService.findAll(filters.profileId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserInput: CreateUserInput): User {
    return this.usersService.create(createUserInput);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserInput: UpdateUserInput): User {
    return this.usersService.update(id, updateUserInput);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    return this.usersService.remove(id);
  }

  @Put(':id/activate')
  activate(@Param('id') id: string): User {
    return this.usersService.activate(id);
  }

  @Put(':id/deactivate')
  deactivate(@Param('id') id: string): User {
    return this.usersService.deactivate(id);
  }
}

