import { Profile, CreateProfileDto, UpdateProfileDto } from '@falconi/shared-types';

/**
 * Interface do repositório de perfis
 * Segue o princípio SOLID - Dependency Inversion
 */
export interface IProfileRepository {
  findAll(): Profile[];
  findById(id: string): Profile | undefined;
  findByName(name: string): Profile | undefined;
  create(profileData: CreateProfileDto): Profile;
  update(id: string, profileData: UpdateProfileDto): Profile;
  delete(id: string): boolean;
  exists(id: string): boolean;
  nameExists(name: string, excludeId?: string): boolean;
}

