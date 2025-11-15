import { Module, forwardRef } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ProfilesModule),
  ],
  providers: [SeedService],
})
export class DatabaseModule {}

