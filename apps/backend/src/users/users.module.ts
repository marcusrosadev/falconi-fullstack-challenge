import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ProfilesModule } from '../profiles/profiles.module';
import { InMemoryUserRepository } from './repositories/in-memory-user.repository';
import { IUserRepository } from './repositories/user.repository.interface';

@Module({
  imports: [ProfilesModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserRepository',
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}

