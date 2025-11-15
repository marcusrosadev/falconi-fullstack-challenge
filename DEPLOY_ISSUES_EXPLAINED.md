# Explicação Completa: Erro "Cannot find module '@falconi/shared-types'"

## 1. 🔧 A Solução Implementada

### O que foi feito:
1. **Criado script pós-build** (`apps/backend/scripts/postbuild.js`) que:
   - Copia o `shared-types/dist` para `node_modules/@falconi/shared-types`
   - Cria um `package.json` no destino para que Node.js reconheça como módulo válido
   - Garante que o módulo esteja disponível em runtime

2. **Atualizado script de build** no `package.json` do backend:
   - Agora executa `nest build && node scripts/postbuild.js`
   - Garante que o módulo seja copiado após cada build

3. **TypeScript movido para dependencies** no `shared-types`:
   - Garante que o TypeScript esteja disponível durante o build no Vercel

---

## 2. 🔍 Causa Raiz do Problema

### O que estava acontecendo vs. o que deveria acontecer:

**O que estava acontecendo:**
1. TypeScript compilava o código com path mappings (`@falconi/shared-types` → `../../packages/shared-types/src`)
2. O código compilado JavaScript ainda continha `require('@falconi/shared-types')`
3. Em runtime, Node.js tentava resolver via `node_modules`, não via path mappings
4. O workspace do npm deveria criar um symlink, mas no Vercel isso não funcionava corretamente
5. Resultado: `Cannot find module '@falconi/shared-types'`

**O que deveria acontecer:**
1. TypeScript compila o código
2. O módulo `@falconi/shared-types` deve estar disponível em `node_modules/@falconi/shared-types`
3. Node.js resolve o módulo normalmente via `node_modules`
4. A aplicação funciona corretamente

### Condições que triggeraram o erro:

1. **Ambiente de produção (Vercel)**: 
   - Workspaces do npm podem não ser linkados corretamente em ambientes serverless
   - O Vercel cria um ambiente isolado para cada função serverless

2. **Compilação vs. Runtime**:
   - TypeScript resolve path mappings durante **compilação**
   - Node.js resolve módulos via `node_modules` durante **runtime**
   - Esses dois processos são diferentes e independentes

3. **Monorepo com workspaces**:
   - Workspaces criam symlinks em `node_modules`
   - Symlinks podem não funcionar corretamente em ambientes serverless
   - O Vercel pode não copiar symlinks corretamente

### O que levou a esse problema:

**Concepção errada:**
- Assumimos que path mappings do TypeScript resolveriam o problema em runtime
- Assumimos que workspaces do npm funcionariam automaticamente no Vercel
- Não consideramos que compilação e runtime são processos separados

**O que faltou:**
- Entender que path mappings são apenas para TypeScript, não para Node.js
- Verificar se o módulo estaria disponível em runtime após o build
- Testar o build em um ambiente similar ao Vercel antes de fazer deploy

---

## 3. 📚 Conceito Fundamental

### Por que esse erro existe?

O erro existe porque há uma **divisão clara entre compilação e runtime**:

1. **Compilação (TypeScript)**:
   - Resolve path mappings (`tsconfig.json` paths)
   - Transforma TypeScript em JavaScript
   - Mantém referências a módulos como estão (`require('@falconi/shared-types')`)

2. **Runtime (Node.js)**:
   - Resolve módulos via algoritmo do Node.js:
     1. Procura em `node_modules` local
     2. Sobe na hierarquia de diretórios
     3. Procura em `node_modules` global
   - **NÃO** entende path mappings do TypeScript
   - **NÃO** segue symlinks de workspaces automaticamente

### Modelo mental correto:

```
┌─────────────────────────────────────────────────────────┐
│ FASE DE COMPILAÇÃO (TypeScript)                        │
├─────────────────────────────────────────────────────────┤
│ 1. TypeScript lê tsconfig.json                         │
│ 2. Resolve path mappings:                              │
│    @falconi/shared-types → ../../packages/.../src      │
│ 3. Compila TypeScript → JavaScript                      │
│ 4. Mantém require('@falconi/shared-types') no código   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ FASE DE RUNTIME (Node.js)                               │
├─────────────────────────────────────────────────────────┤
│ 1. Node.js executa código JavaScript                   │
│ 2. Encontra require('@falconi/shared-types')           │
│ 3. Procura em node_modules/@falconi/shared-types       │
│ 4. ❌ NÃO encontra (workspace não linkado)             │
│ 5. ❌ ERRO: Cannot find module                          │
└─────────────────────────────────────────────────────────┘
```

### Como isso se encaixa no design do framework/linguagem:

- **TypeScript**: Linguagem de desenvolvimento, path mappings são conveniência para desenvolvedores
- **Node.js**: Runtime, segue padrão CommonJS/ESM para resolução de módulos
- **npm workspaces**: Ferramenta de desenvolvimento, symlinks podem não funcionar em produção
- **Vercel**: Ambiente serverless isolado, precisa de todas as dependências explicitamente

---

## 4. ⚠️ Sinais de Alerta

### O que observar para evitar esse problema:

1. **Path mappings no tsconfig.json sem verificação de runtime**:
   ```json
   {
     "paths": {
       "@falconi/shared-types": ["../../packages/shared-types/src"]
     }
   }
   ```
   ⚠️ Isso funciona apenas em compilação, não garante runtime!

2. **Workspaces do npm em monorepos**:
   ```json
   {
     "workspaces": ["apps/*", "packages/*"]
   }
   ```
   ⚠️ Symlinks podem não funcionar em ambientes serverless!

3. **Dependências locais com `*`**:
   ```json
   {
     "dependencies": {
       "@falconi/shared-types": "*"
     }
   }
   ```
   ⚠️ Funciona localmente, mas pode falhar em produção!

### Padrões similares que podem causar problemas:

1. **Aliases do webpack/vite sem configuração de build**:
   - Funciona em dev, mas pode falhar em produção

2. **Módulos não publicados no npm**:
   - Dependências locais que não estão no registry

3. **Builds que não incluem dependências**:
   - Assumir que tudo estará disponível em runtime

### Code smells:

- ✅ **Bom**: Módulo está no `node_modules` após build
- ❌ **Ruim**: Módulo só existe via path mapping
- ✅ **Bom**: Testar build local antes de deploy
- ❌ **Ruim**: Assumir que funciona porque compila sem erros
- ✅ **Bom**: Verificar se módulos estão disponíveis em runtime
- ❌ **Ruim**: Confiar apenas em compilação bem-sucedida

---

## 5. 🔄 Alternativas e Trade-offs

### Alternativa 1: Publicar no npm (privado ou público)
**Como funciona:**
- Publicar `@falconi/shared-types` no npm registry
- Instalar como dependência normal

**Prós:**
- ✅ Funciona em qualquer ambiente
- ✅ Padrão da indústria
- ✅ Não precisa de scripts customizados

**Contras:**
- ❌ Requer conta npm (pode ser privada)
- ❌ Processo de versionamento mais complexo
- ❌ Overhead para mudanças pequenas

**Quando usar:** Projetos que precisam de máxima portabilidade

---

### Alternativa 2: Bundle tudo junto (sem monorepo)
**Como funciona:**
- Colocar `shared-types` dentro do projeto backend
- Não usar workspaces

**Prós:**
- ✅ Simples, sem problemas de resolução
- ✅ Funciona em qualquer ambiente

**Contras:**
- ❌ Duplicação de código se usado em múltiplos projetos
- ❌ Perde benefícios do monorepo
- ❌ Mais difícil manter sincronizado

**Quando usar:** Projetos pequenos, sem necessidade de compartilhamento

---

### Alternativa 3: Usar ferramentas de bundling (webpack, esbuild)
**Como funciona:**
- Bundler resolve todas as dependências e cria um único arquivo
- Inclui `shared-types` no bundle

**Prós:**
- ✅ Tudo incluído no bundle
- ✅ Não depende de `node_modules` em runtime
- ✅ Pode otimizar e tree-shake

**Contras:**
- ❌ Configuração mais complexa
- ❌ Builds mais lentos
- ❌ Debugging mais difícil

**Quando usar:** Aplicações que precisam de otimização máxima

---

### Alternativa 4: Script pós-build (nossa solução atual)
**Como funciona:**
- Script copia módulo para `node_modules` após build
- Garante disponibilidade em runtime

**Prós:**
- ✅ Funciona com monorepo
- ✅ Mantém estrutura atual
- ✅ Solução simples e direta

**Contras:**
- ❌ Requer script adicional
- ❌ Pode quebrar se estrutura mudar
- ❌ Não é padrão da indústria

**Quando usar:** Monorepos que precisam funcionar em ambientes serverless

---

## 6. ✅ Verificação da Solução

### Como verificar se está funcionando:

1. **Localmente:**
   ```bash
   cd apps/backend
   npm run build
   ls node_modules/@falconi/shared-types
   # Deve mostrar: index.js, index.d.ts, package.json
   ```

2. **No Vercel:**
   - Verificar logs de build: deve mostrar "✅ @falconi/shared-types copiado"
   - Verificar runtime: não deve ter erro de módulo não encontrado

3. **Teste de importação:**
   ```javascript
   // Em runtime, isso deve funcionar:
   const { User } = require('@falconi/shared-types');
   ```

---

## 7. 📝 Lições Aprendidas

1. **Compilação ≠ Runtime**: Path mappings do TypeScript não resolvem em runtime
2. **Workspaces podem falhar**: Symlinks não funcionam em todos os ambientes
3. **Sempre testar build**: Não assumir que compilação bem-sucedida = runtime funcionando
4. **Ambientes serverless são diferentes**: Isolamento pode quebrar suposições locais
5. **Documentar dependências**: Deixar claro quais módulos precisam estar disponíveis

---

## 8. 🔮 Prevenção Futura

### Checklist antes de fazer deploy:

- [ ] Verificar se todos os módulos estão em `node_modules` após build
- [ ] Testar build local antes de deploy
- [ ] Verificar logs de build no Vercel
- [ ] Testar importação de módulos em runtime
- [ ] Documentar dependências locais e como são resolvidas

### Boas práticas:

1. **Sempre testar build de produção localmente**
2. **Verificar estrutura de `node_modules` após build**
3. **Usar ferramentas como `npm ls` para verificar dependências**
4. **Considerar publicar pacotes compartilhados no npm**
5. **Documentar processo de build e deploy**

