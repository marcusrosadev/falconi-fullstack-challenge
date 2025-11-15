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
falconi-fullstack-challenge/
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

## 🔐 Autenticação e Usuários Mockados

O sistema possui autenticação simples baseada em email. Os seguintes usuários estão disponíveis para login:

### Usuários Disponíveis

| Nome | Email | Perfil | Permissões |
|------|-------|--------|------------|
| João Silva | `joao.silva@example.com` | Administrador | ✅ Ver usuários<br>✅ Criar usuários<br>✅ Editar usuários (todos)<br>✅ Excluir usuários<br>✅ Ativar/Desativar usuários (todos)<br>✅ Ver perfis<br>✅ Gerenciar perfis |
| Maria Santos | `maria.santos@example.com` | Editor | ✅ Ver usuários<br>✅ Criar usuários<br>✅ Editar usuários (exceto Administradores)<br>❌ Excluir usuários<br>✅ Ativar/Desativar usuários (apenas Visitantes) |
| Pedro Oliveira | `pedro.oliveira@example.com` | Visitante | ✅ Ver usuários<br>❌ Criar usuários<br>❌ Editar usuários<br>❌ Excluir usuários<br>❌ Ativar/Desativar usuários |

### Como Fazer Login

1. Acesse a aplicação em `http://localhost:3000`
2. Você será redirecionado para a tela de login
3. Digite o email de um dos usuários acima (ex: `joao.silva@example.com`)
4. Clique em "Entrar"

> **Nota:** A autenticação atual é simplificada e não requer senha. Apenas o email é necessário para login. Em produção, isso deve ser substituído por um sistema de autenticação robusto com senhas criptografadas.

### Permissões por Perfil

- **Administrador**: 
  - Acesso total ao sistema
  - Pode criar, editar, excluir e ativar/desativar qualquer usuário
  - Pode gerenciar perfis
  
- **Editor**: 
  - Pode criar novos usuários
  - Pode editar usuários, **exceto Administradores**
  - **NÃO pode excluir usuários**
  - Pode ativar/desativar usuários, **mas apenas Visitantes** (não pode ativar/desativar outros Editores ou Administradores)
  
- **Visitante**: 
  - Apenas visualização de usuários
  - Sem permissão para criar, editar, excluir ou ativar/desativar usuários

## 📋 Funcionalidades Implementadas

### Autenticação
- ✅ Tela de login com gradiente moderno
- ✅ Sistema de autenticação baseado em email
- ✅ Proteção de rotas baseada em permissões
- ✅ Contexto de autenticação com persistência (localStorage)
- ✅ Logout funcional

### Usuários
- ✅ Criar usuário (requer permissão)
- ✅ Editar usuário (requer permissão)
- ✅ Remover usuário (requer permissão)
- ✅ Listar todos os usuários
- ✅ Buscar usuário por ID
- ✅ Ativar usuário (requer permissão)
- ✅ Desativar usuário (requer permissão)
- ✅ Filtrar usuários por perfil
- ✅ Buscar por nome/email
- ✅ Paginação
- ✅ Ordenação por nome, email, perfil e status (asc/desc)
- ✅ Exportação de dados (CSV/JSON)

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

## 🎯 Decisões Técnicas e Justificativas

Esta seção explica o **motivo por trás** de cada decisão técnica tomada no projeto, conforme solicitado no desafio. Cada escolha foi feita considerando manutenibilidade, escalabilidade, performance e experiência do desenvolvedor.

### Arquitetura
- **Monorepo com npm workspaces**: Facilita o compartilhamento de tipos e gerenciamento de dependências. Escolhido para manter sincronização automática de tipos entre frontend e backend, evitando inconsistências e facilitando refatorações.
- **Pacote shared-types**: Garante consistência de tipos entre frontend e backend. Centraliza definições de tipos (User, Profile, DTOs) em um único lugar, garantindo que mudanças sejam refletidas em ambas as aplicações simultaneamente.
- **Separação clara de responsabilidades**: Módulos separados para Users e Profiles. Facilita manutenção, testes e escalabilidade. Cada módulo tem seu próprio controller, service e repository.
- **Camada de serviço API**: Separação da lógica de comunicação HTTP do componente (src/services/api.ts). Isola a lógica de requisições HTTP, facilitando testes, reutilização e manutenção. Permite trocar a implementação HTTP sem afetar os componentes.

### Backend
- **NestJS**: Framework robusto com suporte nativo a TypeScript, decorators e injeção de dependências.
- **Dados em memória**: Arrays simples para armazenamento, sem necessidade de banco de dados.
- **Repository Pattern**: Abstração através de interfaces (IUserRepository, IProfileRepository) permite trocar implementação (memória → banco de dados) sem alterar services. Facilita testes unitários com mocks.
- **Validações**: Verificação de integridade referencial e unicidade de email/nome. Validações no service garantem regras de negócio (ex: não permitir excluir único admin ativo). Validação de email duplicado evita inconsistências.
- **Status codes apropriados**: 200, 201, 204, 400, 404 conforme o padrão REST. Facilita integração e debugging, seguindo convenções amplamente aceitas.
- **CORS configurado**: Permite comunicação com o frontend. Configurado para aceitar requisições do frontend em desenvolvimento e produção.
- **Swagger/OpenAPI**: Documentação interativa da API. Facilita testes e integração, permitindo que desenvolvedores entendam e testem endpoints sem necessidade de código adicional.

### Frontend
- **Next.js 14 com App Router**: Última versão com suporte a Server Components e melhor performance. App Router oferece melhor organização de rotas e suporte a layouts aninhados. Server Components reduzem bundle size e melhoram performance.
- **Client Components**: Uso de 'use client' onde necessário para interatividade. Apenas componentes que precisam de interatividade (formulários, botões) são client components, mantendo a maioria como server components para melhor performance.
- **Tailwind CSS**: Estilização moderna e responsiva. Utility-first CSS permite desenvolvimento rápido e consistente. Classes utilitárias facilitam manutenção e padronização visual.
- **Gerenciamento de estado**: useState e useEffect para estado local. Escolhido por simplicidade e adequação ao escopo do projeto. Para aplicações maiores, considerar Context API ou bibliotecas como Zustand/Redux.
- **Validação de formulários**: Validação em tempo real com feedback visual. Validação no frontend melhora UX (feedback imediato) e reduz requisições desnecessárias. Validação no backend garante segurança e integridade dos dados.
- **Tratamento de erros robusto**: Classe ApiError customizada e mensagens amigáveis. Centraliza tratamento de erros, permitindo mensagens consistentes e traduzidas para o usuário final.
- **Feedback visual**: Mensagens de sucesso/erro com auto-dismiss e loading states. Toast notifications melhoram UX, informando o usuário sobre ações sem interromper o fluxo de trabalho.
- **UX aprimorada**: Indicadores visuais de carregamento, validação de campos e estados desabilitados. Melhora a experiência do usuário, deixando claro o estado da aplicação e ações disponíveis.
- **Animações CSS customizadas**: Classes fade-in, slide-up, slide-down, scale-in. Animações suaves melhoram percepção de qualidade e guiam atenção do usuário. Implementadas via CSS para performance (GPU-accelerated).
- **Ordenação client-side**: Ordenação realizada no frontend após receber dados. Decisão tomada para simplicidade e responsividade imediata. Para grandes volumes, considerar ordenação server-side.
- **Exportação de dados**: Funções para exportar CSV/JSON. Permite que usuários extraiam dados para análise externa. Timestamp no nome do arquivo facilita organização.

### TypeScript
- **Tipagem estrita**: Garantia de type safety em toda a aplicação. Previne erros em tempo de compilação, reduzindo bugs em produção e melhorando experiência de desenvolvimento com autocomplete.
- **Tipos compartilhados**: Evita duplicação e inconsistências. Um único ponto de verdade para tipos garante que frontend e backend sempre estejam sincronizados.
- **Interfaces bem definidas**: DTOs claros para comunicação entre camadas. Facilita entendimento do contrato entre frontend e backend, servindo como documentação viva do código.

## 🔄 Fluxo de Dados

1. Frontend faz requisição HTTP para o backend
2. Backend processa a requisição, valida dados e atualiza estado em memória
3. Backend retorna resposta com status code apropriado
4. Frontend atualiza a interface baseado na resposta

## 📝 Dados Mockados

A aplicação inicializa automaticamente com:
- 3 perfis: Administrador, Editor, Visitante
- 3 usuários de exemplo vinculados aos perfis

## ✨ Melhorias Implementadas Recentemente

- ✅ **Camada de serviço API separada**: Código de comunicação HTTP organizado em `src/services/api.ts` - Isola lógica HTTP, facilita testes e manutenção
- ✅ **Validação de formulários robusta**: Validação em tempo real com feedback visual por campo - Melhora UX com feedback imediato e reduz erros
- ✅ **Tratamento de erros aprimorado**: Classe ApiError customizada com mensagens amigáveis - Centraliza tratamento de erros com mensagens consistentes
- ✅ **Feedback visual melhorado**: Mensagens de sucesso/erro com auto-dismiss, loading states animados - Toast notifications melhoram comunicação com usuário
- ✅ **UX aprimorada**: Indicadores visuais, validação de email, campos obrigatórios marcados - Interface mais intuitiva e acessível
- ✅ **Busca por nome/email**: Campo de busca com debounce de 300ms - Reduz requisições desnecessárias e melhora performance
- ✅ **Paginação**: Sistema completo de paginação com controles visuais - Permite navegação eficiente em grandes listas
- ✅ **Ordenação (sort)**: Ordenação por nome, email, perfil e status (asc/desc) - Facilita localização e análise de dados
- ✅ **Exportação de dados**: Exportação para CSV e JSON com timestamp - Permite análise externa e backup de dados
- ✅ **Filtros avançados**: Filtro por perfil combinado com busca - Permite refinamento preciso de resultados
- ✅ **Animações de transição**: Classes CSS customizadas (fade-in, slide-up, slide-down, scale-in) - Melhora percepção de qualidade e guia atenção
- ✅ **Documentação Swagger**: API documentada com Swagger/OpenAPI em `/api` - Facilita testes e integração
- ✅ **Testes unitários**: Testes básicos para services implementados - Garante qualidade e facilita refatorações
- ✅ **Ícones com tooltips**: Ações da tabela substituídas por ícones intuitivos - Interface mais limpa e moderna
- ✅ **Placeholders melhorados**: Textos de placeholder mais escuros e informativos - Melhora acessibilidade e UX
- ✅ **Variáveis de ambiente**: Suporte a PORT e NEXT_PUBLIC_API_URL - Facilita deploy em diferentes ambientes

## 🚧 Possíveis Melhorias

Veja o arquivo [TODO.md](./TODO.md) para uma lista completa e detalhada de melhorias futuras.

### Curto Prazo
- [x] Adicionar testes unitários e de integração
- [x] Implementar paginação para listas grandes
- [x] Adicionar busca por nome/email
- [x] Documentação da API com Swagger/OpenAPI
- [x] Ordenação (sort) na tabela de usuários
- [x] Exportação de dados (CSV/JSON)
- [x] Animações de transição suaves
- [x] Filtros avançados

> **Nota:** Para usar o Swagger, instale a dependência: `npm install` (na raiz) ou `cd apps/backend && npm install @nestjs/swagger`

### Médio Prazo
- [x] Autenticação e autorização
- [x] Tratamento de erros mais robusto
- [x] Variáveis de ambiente configuradas

### Longo Prazo
- [ ] Implementar testes E2E
- [ ] CI/CD pipeline
- [ ] Dockerização da aplicação
- [ ] Monitoramento e observabilidade
- [ ] Cache para melhorar performance

## 💡 Explicações Adicionais sobre Decisões Técnicas

### Por que ordenação client-side e não server-side?
A ordenação foi implementada no frontend para **simplicidade e responsividade imediata**. Com dados em memória no backend e volumes moderados, a ordenação client-side oferece feedback instantâneo ao usuário sem necessidade de requisições adicionais. Para grandes volumes (milhares de registros), seria recomendado mover para server-side com índices de banco de dados.

### Por que debounce de 300ms na busca?
O debounce de 300ms é um **balanceamento entre responsividade e performance**. Valores menores (< 200ms) podem causar muitas requisições durante digitação rápida. Valores maiores (> 500ms) tornam a interface "lenta" para o usuário. 300ms é um valor padrão da indústria que oferece boa experiência.

### Por que animações CSS ao invés de bibliotecas?
Animações foram implementadas via **CSS puro** (keyframes) para:
- **Performance**: Animações CSS são GPU-accelerated, mais performáticas que JavaScript
- **Bundle size**: Não adiciona dependências externas
- **Simplicidade**: Fácil de manter e customizar
- **Compatibilidade**: Funciona em todos os navegadores modernos

### Por que Repository Pattern com dados em memória?
O Repository Pattern foi implementado mesmo com dados em memória para:
- **Testabilidade**: Facilita criação de mocks em testes unitários
- **Escalabilidade**: Permite migração futura para banco de dados sem alterar lógica de negócio
- **Separação de responsabilidades**: Isola lógica de acesso a dados da lógica de negócio
- **Demonstração de conhecimento**: Mostra compreensão de padrões de design importantes

### Por que validação dupla (frontend + backend)?
Validação no **frontend** melhora UX (feedback imediato) e reduz requisições desnecessárias. Validação no **backend** é obrigatória por segurança - nunca confiar apenas no frontend. Esta abordagem oferece melhor experiência do usuário mantendo segurança.

### Por que autenticação simples baseada em email?
Para o escopo do desafio, autenticação simplificada (sem senha) foi escolhida para:
- **Foco na funcionalidade principal**: Permitir concentração em gerenciamento de usuários
- **Simplicidade de teste**: Facilita demonstração e testes
- **Clareza**: Deixa claro que em produção seria necessário sistema robusto com JWT, refresh tokens, etc.

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.

