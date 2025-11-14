import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { Profile, CreateProfileDto, UpdateProfileDto } from '@falconi/shared-types';
import { IProfileRepository } from './repositories/profile.repository.interface';

/**
 * Service de perfis
 * Segue o princípio SOLID - Single Responsibility
 * Responsável apenas pela lógica de negócio e validações
 * Usa repositório para acesso a dados (Dependency Inversion)
 */
@Injectable()
export class ProfilesService {
  constructor(
    @Inject('IProfileRepository')
    private readonly profileRepository: IProfileRepository,
  ) {
    // Inicializar com alguns perfis mockados
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Criar perfis iniciais apenas se não existirem
    const initialProfiles = ['Administrador', 'Usuário', 'Visitante'];
    initialProfiles.forEach((name) => {
      if (!this.profileRepository.findByName(name)) {
        this.create({ name });
      }
    });
  }

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
    // Validação de negócio: nome único
    if (this.profileRepository.nameExists(createProfileDto.name)) {
      throw new BadRequestException(`Perfil com nome ${createProfileDto.name} já existe`);
    }

    // Delegar criação ao repositório
    return this.profileRepository.create(createProfileDto);
  }

  update(id: string, updateProfileDto: UpdateProfileDto): Profile {
    // Validação: verificar se perfil existe
    if (!this.profileRepository.exists(id)) {
      throw new NotFoundException(`Perfil com ID ${id} não encontrado`);
    }

    // Validação de negócio: nome único se estiver sendo atualizado
    if (updateProfileDto.name) {
      if (this.profileRepository.nameExists(updateProfileDto.name, id)) {
        throw new BadRequestException(`Perfil com nome ${updateProfileDto.name} já existe`);
      }
    }

    // Delegar atualização ao repositório
    return this.profileRepository.update(id, updateProfileDto);
  }

  remove(id: string): void {
    const deleted = this.profileRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Perfil com ID ${id} não encontrado`);
    }
  }
}

