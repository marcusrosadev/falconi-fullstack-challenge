import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { LoginInput, AuthResponse, User, Profile, Permission } from '@falconi/shared-types';
import { IUserRepository } from '../users/repositories/user.repository.interface';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class AuthService {
  // Mapeamento de permissões por perfil
  private readonly profilePermissions: Record<string, Permission[]> = {
    'Administrador': [
      Permission.VIEW_USERS,
      Permission.CREATE_USERS,
      Permission.EDIT_USERS,
      Permission.DELETE_USERS,
      Permission.ACTIVATE_USERS,
      Permission.VIEW_PROFILES,
      Permission.MANAGE_PROFILES,
    ],
    'Editor': [
      Permission.VIEW_USERS,
      Permission.CREATE_USERS,
      Permission.EDIT_USERS, // Pode editar, mas não admins
      Permission.ACTIVATE_USERS, // Pode ativar/desativar apenas visitantes
    ],
    'Visitante': [
      Permission.VIEW_USERS,
    ],
  };

  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly profilesService: ProfilesService,
  ) {}

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = this.userRepository.findByEmail(loginInput.email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo. Entre em contato com o administrador.');
    }

    const profile = this.profilesService.findOne(user.profileId);
    if (!profile) {
      throw new UnauthorizedException('Perfil não encontrado');
    }

    return {
      user,
      profile,
    };
  }

  getPermissions(profileName: string): Permission[] {
    return this.profilePermissions[profileName] || [];
  }

  hasPermission(profileName: string, permission: Permission): boolean {
    const permissions = this.getPermissions(profileName);
    return permissions.includes(permission);
  }
}

