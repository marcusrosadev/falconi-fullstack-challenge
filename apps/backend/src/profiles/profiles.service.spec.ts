import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { IProfileRepository } from './repositories/profile.repository.interface';
import { Profile, CreateProfileDto } from '@falconi/shared-types';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let mockRepository: jest.Mocked<IProfileRepository>;

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      nameExists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: 'IProfileRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('deve retornar um perfil quando encontrado', () => {
      const profile: Profile = {
        id: '1',
        name: 'Administrador',
      };

      mockRepository.findById.mockReturnValue(profile);

      const result = service.findOne('1');

      expect(result).toEqual(profile);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('deve lançar NotFoundException quando perfil não encontrado', () => {
      mockRepository.findById.mockReturnValue(undefined);

      expect(() => service.findOne('1')).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar um perfil com sucesso', () => {
      const createDto: CreateProfileDto = {
        name: 'Novo Perfil',
      };

      const createdProfile: Profile = {
        id: '1',
        ...createDto,
      };

      mockRepository.nameExists.mockReturnValue(false);
      mockRepository.create.mockReturnValue(createdProfile);

      const result = service.create(createDto);

      expect(result).toEqual(createdProfile);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('deve lançar BadRequestException quando nome já existe', () => {
      const createDto: CreateProfileDto = {
        name: 'Administrador',
      };

      mockRepository.nameExists.mockReturnValue(true);

      expect(() => service.create(createDto)).toThrow(BadRequestException);
      expect(() => service.create(createDto)).toThrow('já existe');
    });
  });

  describe('remove', () => {
    it('deve remover um perfil com sucesso', () => {
      mockRepository.delete.mockReturnValue(true);

      service.remove('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('deve lançar NotFoundException quando perfil não encontrado', () => {
      mockRepository.delete.mockReturnValue(false);

      expect(() => service.remove('1')).toThrow(NotFoundException);
    });
  });
});

