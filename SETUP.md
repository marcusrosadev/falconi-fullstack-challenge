# Guia de Instalação Rápida

## Passo a Passo

### 1. Instalar Dependências do Monorepo

No diretório raiz do projeto, execute:

```bash
npm install
```

Este comando instalará todas as dependências de todos os workspaces (backend, frontend e shared-types).

### 2. Compilar o Pacote de Tipos Compartilhados

Antes de rodar o backend ou frontend, é necessário compilar o pacote de tipos compartilhados:

```bash
cd packages/shared-types
npm run build
cd ../..
```

Ou, se preferir, execute diretamente:

```bash
npm run build --workspace=packages/shared-types
```

### 3. Executar o Backend

Em um terminal, execute:

```bash
npm run dev:backend
```

O backend estará disponível em: **http://localhost:3001**

### 4. Executar o Frontend

Em outro terminal, execute:

```bash
npm run dev:frontend
```

O frontend estará disponível em: **http://localhost:3000**

## Comandos Disponíveis

### No diretório raiz:

- `npm install` - Instala todas as dependências
- `npm run dev:backend` - Inicia o backend em modo desenvolvimento
- `npm run dev:frontend` - Inicia o frontend em modo desenvolvimento
- `npm run build:backend` - Compila o backend
- `npm run build:frontend` - Compila o frontend
- `npm run build` - Compila backend e frontend

### No diretório packages/shared-types:

- `npm run build` - Compila os tipos TypeScript
- `npm run dev` - Compila em modo watch

### No diretório apps/backend:

- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm run start:prod` - Inicia em modo produção

### No diretório apps/frontend:

- `npm run dev` - Inicia em modo desenvolvimento
- `npm run build` - Compila o projeto
- `npm run start` - Inicia em modo produção

## Troubleshooting

### Erro: "Cannot find module 'dist/main'" ou "Cannot find module 'dist/apps/backend/src/main'"

**Causa:** O NestJS está tentando executar o arquivo compilado que não existe ainda, ou o caminho está incorreto.

**Solução:** 
1. O NestJS em monorepo compila para `dist/apps/backend/src/main.js` (não `dist/main.js`)
2. Certifique-se de usar `npm run dev:backend` (não `npm start` ou `npm run start`)
3. O script `dev` usa `nest start --watch` que compila automaticamente na primeira execução
4. Se o erro persistir, compile manualmente primeiro:
   ```bash
   cd apps/backend
   npm run build
   npm run dev
   ```
5. Para produção, use o caminho correto: `node dist/apps/backend/src/main`

### Aviso: "ENOWORKSPACES" no Frontend

**Causa:** Aviso informativo do npm sobre comandos que não suportam workspaces.

**Solução:** Este é apenas um aviso e pode ser ignorado. O Next.js continuará funcionando normalmente. O servidor estará disponível em `http://localhost:3000`.

### Erro: "Cannot find module '@falconi/shared-types'"

**Solução:** Compile o pacote shared-types primeiro:
```bash
cd packages/shared-types
npm run build
cd ../..
```

### Erro: "Port already in use"

**Solução:** Altere a porta no arquivo correspondente:
- Backend: `apps/backend/src/main.ts` (linha com `process.env.PORT || 3001`)
- Frontend: `apps/frontend/package.json` (script dev) ou crie um arquivo `.env.local` com `PORT=3000`

### Erro de CORS no frontend

**Solução:** Verifique se o backend está rodando e se a URL está correta. O CORS está configurado para aceitar requisições de `http://localhost:3000`.

## Estrutura de Pastas

```
falconi-fullstack-challenge/
├── apps/
│   ├── backend/              # API NestJS
│   │   ├── src/
│   │   │   ├── users/        # Módulo de usuários
│   │   │   ├── profiles/    # Módulo de perfis
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── package.json
│   └── frontend/             # App Next.js
│       ├── src/
│       │   ├── app/         # App Router
│       │   └── components/  # Componentes React
│       └── package.json
├── packages/
│   └── shared-types/         # Tipos compartilhados
│       ├── src/
│       │   └── index.ts
│       └── package.json
├── package.json              # Configuração do monorepo
└── README.md

```

