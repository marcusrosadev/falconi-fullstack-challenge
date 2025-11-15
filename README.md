# Desafio Técnico Fullstack - Falconi

Aplicação fullstack para gerenciamento de usuários e perfis, desenvolvida com NestJS (backend) e Next.js (frontend), utilizando TypeScript e dados mockados em memória.

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js para construção de APIs RESTful
- **TypeScript** - Tipagem estática
- **Express** - Plataforma web (via NestJS)

### Frontend
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário

### Estrutura
- **Monorepo** - Gerenciado com npm workspaces
- **Shared Types** - Pacote compartilhado de tipos TypeScript

## 📁 Estrutura do Projeto

```
falconi/
├── apps/
│   ├── backend/          # API RESTful com NestJS
│   └── frontend/         # Interface com Next.js
├── packages/
│   └── shared-types/     # Tipos compartilhados
├── package.json          # Configuração do monorepo
└── README.md
```

## 🛠️ Como Executar

### Pré-requisitos
- Node.js >= 18.0.0
- npm >= 9.0.0

### Instalação

1. **Instalar dependências do monorepo:**
```bash
npm install
```

2. **Compilar o pacote de tipos compartilhados:**
```bash
cd packages/shared-types
npm run build
cd ../..
```

### Execução

#### Backend (Terminal 1)
```bash
npm run dev:backend
```
O backend estará disponível em: `http://localhost:3001`

> **Nota**: O NestJS compila automaticamente em modo watch. Se encontrar erros de módulo não encontrado, certifique-se de que todas as dependências foram instaladas com `npm install` na raiz do projeto.

#### Frontend (Terminal 2)
```bash
npm run dev:frontend
```
O frontend estará disponível em: `http://localhost:3000`

> **Nota**: Você pode ver um aviso `ENOWORKSPACES` do npm ao rodar comandos dentro de workspaces. Isso é apenas informativo e não afeta o funcionamento do Next.js. O servidor continuará rodando normalmente.

## 📋 Funcionalidades Implementadas

### Usuários
- ✅ Criar usuário
- ✅ Editar usuário
- ✅ Remover usuário
- ✅ Listar todos os usuários
- ✅ Buscar usuário por ID
- ✅ Ativar usuário
- ✅ Desativar usuário
- ✅ Filtrar usuários por perfil

### Perfis
- ✅ Criar perfil
- ✅ Editar perfil
- ✅ Remover perfil
- ✅ Listar todos os perfis
- ✅ Buscar perfil por ID

### Relacionamentos
- ✅ Relacionamento User ↔ Profile corretamente modelado
- ✅ Validação de integridade referencial
- ✅ Dados mockados inicializados automaticamente

## 🔌 Endpoints da API

### Documentação Swagger
Acesse a documentação interativa da API em: `http://localhost:3001/api`

### Usuários
- `GET /users` - Lista todos os usuários
  - Query params: `?profileId=xxx` (filtrar por perfil), `?search=termo` (buscar por nome/email), `?page=1&limit=10` (paginação)
- `GET /users/:id` - Busca usuário por ID
- `POST /users` - Cria novo usuário
- `PUT /users/:id` - Atualiza usuário
- `DELETE /users/:id` - Remove usuário
- `PUT /users/:id/activate` - Ativa usuário
- `PUT /users/:id/deactivate` - Desativa usuário

### Perfis
- `GET /profiles` - Lista todos os perfis
- `GET /profiles/:id` - Busca perfil por ID
- `POST /profiles` - Cria novo perfil
- `PUT /profiles/:id` - Atualiza perfil
- `DELETE /profiles/:id` - Remove perfil

## 🎯 Decisões Técnicas

### Arquitetura
- **Monorepo com npm workspaces**: Facilita o compartilhamento de tipos e gerenciamento de dependências
- **Pacote shared-types**: Garante consistência de tipos entre frontend e backend
- **Separação clara de responsabilidades**: Módulos separados para Users e Profiles
- **Camada de serviço API**: Separação da lógica de comunicação HTTP do componente (src/services/api.ts)

### Backend
- **NestJS**: Framework robusto com suporte nativo a TypeScript, decorators e injeção de dependências
- **Dados em memória**: Arrays simples para armazenamento, sem necessidade de banco de dados
- **Validações**: Verificação de integridade referencial e unicidade de email/nome
- **Status codes apropriados**: 200, 201, 204, 400, 404 conforme o padrão REST
- **CORS configurado**: Permite comunicação com o frontend

### Frontend
- **Next.js 14 com App Router**: Última versão com suporte a Server Components e melhor performance
- **Client Components**: Uso de 'use client' onde necessário para interatividade
- **Tailwind CSS**: Estilização moderna e responsiva
- **Gerenciamento de estado**: useState e useEffect para estado local
- **Validação de formulários**: Validação em tempo real com feedback visual
- **Tratamento de erros robusto**: Classe ApiError customizada e mensagens amigáveis
- **Feedback visual**: Mensagens de sucesso/erro com auto-dismiss e loading states
- **UX aprimorada**: Indicadores visuais de carregamento, validação de campos e estados desabilitados

### TypeScript
- **Tipagem estrita**: Garantia de type safety em toda a aplicação
- **Tipos compartilhados**: Evita duplicação e inconsistências
- **Interfaces bem definidas**: DTOs claros para comunicação entre camadas

## 🔄 Fluxo de Dados

1. Frontend faz requisição HTTP para o backend
2. Backend processa a requisição, valida dados e atualiza estado em memória
3. Backend retorna resposta com status code apropriado
4. Frontend atualiza a interface baseado na resposta

## 📝 Dados Mockados

A aplicação inicializa automaticamente com:
- 3 perfis: Administrador, Usuário, Visitante
- 3 usuários de exemplo vinculados aos perfis

## ✨ Melhorias Implementadas Recentemente

- ✅ **Camada de serviço API separada**: Código de comunicação HTTP organizado em `src/services/api.ts`
- ✅ **Validação de formulários robusta**: Validação em tempo real com feedback visual por campo
- ✅ **Tratamento de erros aprimorado**: Classe ApiError customizada com mensagens amigáveis
- ✅ **Feedback visual melhorado**: Mensagens de sucesso/erro com auto-dismiss, loading states animados
- ✅ **UX aprimorada**: Indicadores visuais, validação de email, campos obrigatórios marcados
- ✅ **Busca por nome/email**: Campo de busca com debounce de 300ms
- ✅ **Paginação**: Sistema completo de paginação com controles visuais
- ✅ **Documentação Swagger**: API documentada com Swagger/OpenAPI em `/api`
- ✅ **Testes unitários**: Testes básicos para services implementados
- ✅ **Ícones com tooltips**: Ações da tabela substituídas por ícones intuitivos
- ✅ **Placeholders melhorados**: Textos de placeholder mais escuros e informativos

## 🚧 Possíveis Melhorias

Veja o arquivo [TODO.md](./TODO.md) para uma lista completa e detalhada de melhorias futuras.

### Curto Prazo
- [x] Adicionar testes unitários e de integração
- [x] Implementar paginação para listas grandes
- [x] Adicionar busca por nome/email
- [x] Documentação da API com Swagger/OpenAPI

> **Nota:** Para usar o Swagger, instale a dependência: `npm install` (na raiz) ou `cd apps/backend && npm install @nestjs/swagger`

### Médio Prazo
- [ ] Integração com banco de dados (MySQL conforme requisitos da vaga)
- [ ] Autenticação e autorização
- [ ] Logging estruturado
- [ ] Tratamento de erros mais robusto

### Longo Prazo
- [ ] Implementar testes E2E
- [ ] CI/CD pipeline
- [ ] Dockerização da aplicação
- [ ] Monitoramento e observabilidade
- [ ] Cache para melhorar performance
- [ ] Suporte a desenvolvimento mobile (Capacitor, conforme vaga)

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.

