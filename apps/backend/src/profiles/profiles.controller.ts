import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { Profile, CreateProfileDto, UpdateProfileDto } from '@falconi/shared-types';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os perfis' })
  @ApiResponse({ status: 200, description: 'Lista de perfis retornada com sucesso' })
  findAll(): Profile[] {
    return this.profilesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar perfil por ID' })
  @ApiParam({ name: 'id', description: 'ID do perfil' })
  @ApiResponse({ status: 200, description: 'Perfil encontrado' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  findOne(@Param('id') id: string): Profile {
    return this.profilesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo perfil' })
  @ApiResponse({ status: 201, description: 'Perfil criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createProfileDto: CreateProfileDto): Profile {
    return this.profilesService.create(createProfileDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar perfil' })
  @ApiParam({ name: 'id', description: 'ID do perfil' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto): Profile {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir perfil' })
  @ApiParam({ name: 'id', description: 'ID do perfil' })
  @ApiResponse({ status: 204, description: 'Perfil excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  remove(@Param('id') id: string): void {
    return this.profilesService.remove(id);
  }
}

