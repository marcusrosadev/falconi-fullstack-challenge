import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { InMemoryProfileRepository } from './repositories/in-memory-profile.repository';
import { IProfileRepository } from './repositories/profile.repository.interface';

@Module({
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    {
      provide: 'IProfileRepository',
      useClass: InMemoryProfileRepository,
    },
  ],
  exports: [ProfilesService, 'IProfileRepository'],
})
export class ProfilesModule {}

