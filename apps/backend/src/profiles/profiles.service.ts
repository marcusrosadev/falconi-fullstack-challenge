import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Profile, CreateProfileDto, UpdateProfileDto } from '@falconi/shared-types';
import { IProfileRepository } from './repositories/profile.repository.interface';

@Injectable()
export class ProfilesService {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {}

  findAll(): Profile[] {
    return this.profileRepository.findAll();
  }

  findOne(id: string): Profile {
    const profile = this.profileRepository.findById(id);
    if (!profile) {
      throw new NotFoundException(`Perfil com ID ${id} não encontrado`);
    }
    return profile;
  }

  create(createProfileDto: CreateProfileDto): Profile {
    if (this.profileRepository.nameExists(createProfileDto.name)) {
      throw new BadRequestException(`Perfil com nome ${createProfileDto.name} já existe`);
    }

    return this.profileRepository.create(createProfileDto);
  }

  update(id: string, updateProfileDto: UpdateProfileDto): Profile {
    if (!this.profileRepository.exists(id)) {
      throw new NotFoundException(`Perfil com ID ${id} não encontrado`);
    }

    if (updateProfileDto.name) {
      if (this.profileRepository.nameExists(updateProfileDto.name, id)) {
        throw new BadRequestException(`Perfil com nome ${updateProfileDto.name} já existe`);
      }
    }

    return this.profileRepository.update(id, updateProfileDto);
  }

  remove(id: string): void {
    const deleted = this.profileRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Perfil com ID ${id} não encontrado`);
    }
  }
}

