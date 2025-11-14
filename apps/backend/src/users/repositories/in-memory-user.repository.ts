import { Injectable } from '@nestjs/common';
import { User, CreateUserInput, UpdateUserInput } from '@falconi/shared-types';
import { IUserRepository } from './user.repository.interface';

/**
 * Implementação em memória do repositório de usuários
 * Segue o princípio SOLID - Single Responsibility
 * Responsável apenas pelo acesso e manipulação dos dados
 */
@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];
  private nextId = 1;

  findAll(): User[] {
    return [...this.users];
  }

  findById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findByProfileId(profileId: string): User[] {
    return this.users.filter((u) => u.profileId === profileId);
  }

  create(userData: CreateUserInput): User {
    const newUser: User = {
      id: `user-${this.nextId++}`,
      ...userData,
      isActive: true,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, userData: UpdateUserInput): User {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error(`User with id ${id} not found`);
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
    };

    return this.users[userIndex];
  }

  delete(id: string): boolean {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return false;
    }
    this.users.splice(userIndex, 1);
    return true;
  }

  exists(id: string): boolean {
    return this.users.some((u) => u.id === id);
  }

  emailExists(email: string, excludeId?: string): boolean {
    return this.users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== excludeId,
    );
  }
}

