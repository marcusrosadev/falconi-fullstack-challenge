# 🚀 Explicação: `api/index.ts` vs `src/main.ts`

## Por que dois arquivos?

### `apps/backend/src/main.ts` (Desenvolvimento Local)
- **Propósito**: Servidor HTTP tradicional para desenvolvimento local
- **Como funciona**: 
  - Cria uma instância do NestJS
  - Inicia um servidor HTTP na porta 3001 (ou PORT)
  - Roda continuamente enquanto você desenvolve
- **Uso**: `npm run dev:backend` ou `npm run start:dev`

### `apps/backend/api/index.ts` (Vercel Serverless)
- **Propósito**: Handler serverless para Vercel
- **Como funciona**:
  - Exporta uma função `handler` que recebe `req` e `res`
  - Vercel chama essa função para cada requisição
  - Usa cache para reutilizar a instância do NestJS entre requisições
  - Não inicia um servidor HTTP - apenas processa requisições individuais
- **Uso**: Deploy automático na Vercel

## Diferenças Técnicas

| Aspecto | `main.ts` | `api/index.ts` |
|---------|-----------|----------------|
| **Ambiente** | Desenvolvimento local | Produção (Vercel) |
| **Tipo** | Servidor HTTP contínuo | Função serverless |
| **Inicialização** | Uma vez ao iniciar | Por requisição (com cache) |
| **Porta** | 3001 (fixa) | Gerenciada pela Vercel |
| **CORS** | Configurado no NestJS | Configurado + tratamento manual de OPTIONS |

## Por que não é redundante?

1. **Arquiteturas diferentes**:
   - `main.ts`: Servidor tradicional (sempre rodando)
   - `api/index.ts`: Serverless (executa sob demanda)

2. **Vercel precisa de um formato específico**:
   - Vercel espera um handler que exporta uma função
   - Não pode usar `app.listen()` porque não há servidor HTTP tradicional

3. **Otimizações diferentes**:
   - `main.ts`: Otimizado para desenvolvimento (hot reload, etc)
   - `api/index.ts`: Otimizado para produção (cache, cold start, etc)

## Conclusão

**NÃO é redundante!** São dois pontos de entrada para ambientes diferentes:
- **Desenvolvimento**: Use `main.ts`
- **Produção (Vercel)**: Use `api/index.ts`

Ambos compartilham a mesma lógica de negócio (AppModule, controllers, services), mas têm diferentes formas de inicialização devido às diferenças entre servidor tradicional e serverless.

