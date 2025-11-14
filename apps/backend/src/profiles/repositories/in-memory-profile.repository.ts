import { Injectable } from '@nestjs/common';
import { Profile, CreateProfileDto, UpdateProfileDto } from '@falconi/shared-types';
import { IProfileRepository } from './profile.repository.interface';

/**
 * Implementação em memória do repositório de perfis
 * Segue o princípio SOLID - Single Responsibility
 */
@Injectable()
export class InMemoryProfileRepository implements IProfileRepository {
  private profiles: Profile[] = [];
  private nextId = 1;

  findAll(): Profile[] {
    return [...this.profiles];
  }

  findById(id: string): Profile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  findByName(name: string): Profile | undefined {
    return this.profiles.find(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    );
  }

  create(profileData: CreateProfileDto): Profile {
    const newProfile: Profile = {
      id: `profile-${this.nextId++}`,
      ...profileData,
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  update(id: string, profileData: UpdateProfileDto): Profile {
    const profileIndex = this.profiles.findIndex((p) => p.id === id);
    if (profileIndex === -1) {
      throw new Error(`Profile with id ${id} not found`);
    }

    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      ...profileData,
    };

    return this.profiles[profileIndex];
  }

  delete(id: string): boolean {
    const profileIndex = this.profiles.findIndex((p) => p.id === id);
    if (profileIndex === -1) {
      return false;
    }
    this.profiles.splice(profileIndex, 1);
    return true;
  }

  exists(id: string): boolean {
    return this.profiles.some((p) => p.id === id);
  }

  nameExists(name: string, excludeId?: string): boolean {
    return this.profiles.some(
      (p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== excludeId,
    );
  }
}

