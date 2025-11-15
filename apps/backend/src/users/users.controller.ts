import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserFilters,
  PaginationParams,
  PaginatedResponse,
} from '@falconi/shared-types';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiQuery({ name: 'profileId', required: false, description: 'Filtrar por ID do perfil' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome ou email' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página (para paginação)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Itens por página (para paginação)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  findAll(
    @Query('profileId') profileId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): User[] | PaginatedResponse<User> {
    const filters: UserFilters = {};
    if (profileId) filters.profileId = profileId;
    if (search) filters.search = search;

    const pagination: PaginationParams | undefined =
      page || limit
        ? {
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 10,
          }
        : undefined;

    return this.usersService.findAll(filters, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createUserInput: CreateUserInput): User {
    return this.usersService.create(createUserInput);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  update(@Param('id') id: string, @Body() updateUserInput: UpdateUserInput): User {
    return this.usersService.update(id, updateUserInput);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 204, description: 'Usuário excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string): void {
    return this.usersService.remove(id);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Ativar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário ativado com sucesso' })
  activate(@Param('id') id: string): User {
    return this.usersService.activate(id);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Desativar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário desativado com sucesso' })
  deactivate(@Param('id') id: string): User {
    return this.usersService.deactivate(id);
  }
}

