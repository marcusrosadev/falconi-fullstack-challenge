import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { User, CreateUserInput, UpdateUserInput } from '@falconi/shared-types';
import { IUserRepository } from './repositories/user.repository.interface';
import { ProfilesService } from '../profiles/profiles.service';

/**
 * Service de usuários
 * Segue o princípio SOLID - Single Responsibility
 * Responsável apenas pela lógica de negócio e validações
 * Usa repositório para acesso a dados (Dependency Inversion)
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly profilesService: ProfilesService,
  ) {
    // Inicializar com alguns dados mockados
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Buscar perfis existentes (já criados pelo ProfilesService)
    const profiles = this.profilesService.findAll();
    if (profiles.length === 0) return;

    const adminProfile = profiles.find((p) => p.name === 'Administrador');
    const userProfile = profiles.find((p) => p.name === 'Usuário');
    const guestProfile = profiles.find((p) => p.name === 'Visitante');

    // Criar alguns usuários apenas se os perfis existirem
    if (adminProfile) {
      this.create({
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao.silva@example.com',
        profileId: adminProfile.id,
      });
    }

    if (userProfile) {
      this.create({
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@example.com',
        profileId: userProfile.id,
      });
    }

    if (guestProfile) {
      this.create({
        firstName: 'Pedro',
        lastName: 'Oliveira',
        email: 'pedro.oliveira@example.com',
        profileId: guestProfile.id,
      });
    }
  }

  findAll(profileId?: string): User[] {
    if (profileId) {
      return this.userRepository.findByProfileId(profileId);
    }
    return this.userRepository.findAll();
  }

  findOne(id: string): User {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  create(createUserInput: CreateUserInput): User {
    // Validação de negócio: verificar se o perfil existe
    try {
      this.profilesService.findOne(createUserInput.profileId);
    } catch (error) {
      throw new BadRequestException(`Perfil com ID ${createUserInput.profileId} não encontrado`);
    }

    // Validação de negócio: email único
    if (this.userRepository.emailExists(createUserInput.email)) {
      throw new BadRequestException(`Email ${createUserInput.email} já está em uso`);
    }

    // Delegar criação ao repositório
    return this.userRepository.create(createUserInput);
  }

  update(id: string, updateUserInput: UpdateUserInput): User {
    // Validação: verificar se usuário existe
    if (!this.userRepository.exists(id)) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    // Validação de negócio: verificar perfil se estiver sendo atualizado
    if (updateUserInput.profileId) {
      try {
        this.profilesService.findOne(updateUserInput.profileId);
      } catch (error) {
        throw new BadRequestException(`Perfil com ID ${updateUserInput.profileId} não encontrado`);
      }
    }

    // Validação de negócio: email único se estiver sendo atualizado
    if (updateUserInput.email) {
      if (this.userRepository.emailExists(updateUserInput.email, id)) {
        throw new BadRequestException(`Email ${updateUserInput.email} já está em uso`);
      }
    }

    // Delegar atualização ao repositório
    return this.userRepository.update(id, updateUserInput);
  }

  remove(id: string): void {
    const deleted = this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
  }

  activate(id: string): User {
    return this.update(id, { isActive: true });
  }

  deactivate(id: string): User {
    return this.update(id, { isActive: false });
  }
}

