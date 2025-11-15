import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
  PaginationParams,
  PaginatedResponse,
} from '@falconi/shared-types';
import { IUserRepository } from './repositories/user.repository.interface';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly profilesService: ProfilesService,
  ) {}

  findAll(filters?: UserFilters, pagination?: PaginationParams): User[] | PaginatedResponse<User> {
    let users: User[];

    if (filters?.profileId && filters?.search) {
      const profileUsers = this.userRepository.findByProfileId(filters.profileId);
      users = profileUsers.filter((u) => {
        const term = filters.search!.toLowerCase();
        return (
          u.firstName.toLowerCase().includes(term) ||
          u.lastName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(term)
        );
      });
    } else if (filters?.profileId) {
      users = this.userRepository.findByProfileId(filters.profileId);
    } else if (filters?.search) {
      users = this.userRepository.search(filters.search);
    } else {
      users = this.userRepository.findAll();
    }

    if (pagination?.page && pagination?.limit) {
      const page = Math.max(1, pagination.page);
      const limit = Math.max(1, Math.min(100, pagination.limit));
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = users.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        total: users.length,
        page,
        limit,
        totalPages: Math.ceil(users.length / limit),
      };
    }

    return users;
  }

  findOne(id: string): User {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  create(createUserInput: CreateUserInput): User {
    try {
      this.profilesService.findOne(createUserInput.profileId);
    } catch (error) {
      throw new BadRequestException(`Perfil com ID ${createUserInput.profileId} não encontrado`);
    }

    if (this.userRepository.emailExists(createUserInput.email)) {
      throw new BadRequestException(`Email ${createUserInput.email} já está em uso`);
    }

    return this.userRepository.create(createUserInput);
  }

  update(id: string, updateUserInput: UpdateUserInput): User {
    if (!this.userRepository.exists(id)) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    if (updateUserInput.profileId) {
      try {
        this.profilesService.findOne(updateUserInput.profileId);
      } catch (error) {
        throw new BadRequestException(`Perfil com ID ${updateUserInput.profileId} não encontrado`);
      }
    }

    if (updateUserInput.email) {
      if (this.userRepository.emailExists(updateUserInput.email, id)) {
        throw new BadRequestException(`Email ${updateUserInput.email} já está em uso`);
      }
    }

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

