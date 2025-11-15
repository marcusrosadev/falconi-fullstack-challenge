import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserRepository } from './repositories/user.repository.interface';
import { ProfilesService } from '../profiles/profiles.service';
import { User, CreateUserInput } from '@falconi/shared-types';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: jest.Mocked<IUserRepository>;
  let mockProfilesService: jest.Mocked<ProfilesService>;

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByProfileId: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      emailExists: jest.fn(),
    };

    mockProfilesService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'IUserRepository',
          useValue: mockRepository,
        },
        {
          provide: ProfilesService,
          useValue: mockProfilesService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('deve retornar um usuário quando encontrado', () => {
      const user: User = {
        id: '1',
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        isActive: true,
        profileId: 'profile-1',
      };

      mockRepository.findById.mockReturnValue(user);

      const result = service.findOne('1');

      expect(result).toEqual(user);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('deve lançar NotFoundException quando usuário não encontrado', () => {
      mockRepository.findById.mockReturnValue(undefined);

      expect(() => service.findOne('1')).toThrow(NotFoundException);
      expect(() => service.findOne('1')).toThrow('Usuário com ID 1 não encontrado');
    });
  });

  describe('create', () => {
    it('deve criar um usuário com sucesso', () => {
      const createInput: CreateUserInput = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        profileId: 'profile-1',
      };

      const createdUser: User = {
        id: '1',
        ...createInput,
        isActive: true,
      };

      mockProfilesService.findOne.mockReturnValue({ id: 'profile-1', name: 'Admin' } as any);
      mockRepository.emailExists.mockReturnValue(false);
      mockRepository.create.mockReturnValue(createdUser);

      const result = service.create(createInput);

      expect(result).toEqual(createdUser);
      expect(mockRepository.create).toHaveBeenCalledWith(createInput);
    });

    it('deve lançar BadRequestException quando perfil não existe', () => {
      const createInput: CreateUserInput = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        profileId: 'profile-1',
      };

      mockProfilesService.findOne.mockImplementation(() => {
        throw new NotFoundException('Perfil não encontrado');
      });

      expect(() => service.create(createInput)).toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException quando email já existe', () => {
      const createInput: CreateUserInput = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        profileId: 'profile-1',
      };

      mockProfilesService.findOne.mockReturnValue({ id: 'profile-1', name: 'Admin' } as any);
      mockRepository.emailExists.mockReturnValue(true);

      expect(() => service.create(createInput)).toThrow(BadRequestException);
      expect(() => service.create(createInput)).toThrow('já está em uso');
    });
  });

  describe('remove', () => {
    it('deve remover um usuário com sucesso', () => {
      mockRepository.delete.mockReturnValue(true);

      service.remove('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('deve lançar NotFoundException quando usuário não encontrado', () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remove('1')).toThrow(NotFoundException);
    });
  });
});

