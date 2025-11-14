import { User, CreateUserInput, UpdateUserInput } from '@falconi/shared-types';

/**
 * Interface do repositório de usuários
 * Segue o princípio SOLID - Dependency Inversion
 * Permite trocar a implementação sem alterar o Service
 */
export interface IUserRepository {
  findAll(): User[];
  findById(id: string): User | undefined;
  findByEmail(email: string): User | undefined;
  findByProfileId(profileId: string): User[];
  create(userData: CreateUserInput): User;
  update(id: string, userData: UpdateUserInput): User;
  delete(id: string): boolean;
  exists(id: string): boolean;
  emailExists(email: string, excludeId?: string): boolean;
}

