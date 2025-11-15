import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { IUserRepository } from '../users/repositories/user.repository.interface';
import { IProfileRepository } from '../profiles/repositories/profile.repository.interface';
import { CreateUserInput } from '@falconi/shared-types';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  async onModuleInit() {
    setTimeout(() => {
      this.seedProfiles();
      this.seedUsers();
    }, 100);
  }

  private seedProfiles(): void {
    const initialProfiles = ['Administrador', 'Editor', 'Visitante'];
    
    initialProfiles.forEach((name) => {
      if (!this.profileRepository.findByName(name)) {
        this.profileRepository.create({ name });
      }
    });
  }

  private seedUsers(): void {
    const profiles = this.profileRepository.findAll();
    if (profiles.length === 0) return;

    const adminProfile = profiles.find((p) => p.name === 'Administrador');
    const editorProfile = profiles.find((p) => p.name === 'Editor');
    const guestProfile = profiles.find((p) => p.name === 'Visitante');

    const usersToCreate: CreateUserInput[] = [];

    if (adminProfile) {
      usersToCreate.push({
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao.silva@example.com',
        profileId: adminProfile.id,
      });
    }

    if (editorProfile) {
      usersToCreate.push({
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@example.com',
        profileId: editorProfile.id,
      });
    }

    if (guestProfile) {
      usersToCreate.push({
        firstName: 'Pedro',
        lastName: 'Oliveira',
        email: 'pedro.oliveira@example.com',
        profileId: guestProfile.id,
      });
    }

    usersToCreate.forEach((userData) => {
      if (!this.userRepository.emailExists(userData.email)) {
        this.userRepository.create(userData);
      }
    });
  }
}

