/**
 * Script pós-build para garantir que @falconi/shared-types esteja disponível
 * Este script copia o shared-types compilado para node_modules após o build
 * E também para o diretório api para garantir que seja incluído no bundle do Vercel
 */
const fs = require('fs');
const path = require('path');

const sharedTypesDist = path.join(__dirname, '../../../packages/shared-types/dist');
const backendNodeModules = path.join(__dirname, '../node_modules/@falconi');
const sharedTypesTarget = path.join(backendNodeModules, 'shared-types');
const apiNodeModules = path.join(__dirname, '../api/node_modules/@falconi');
const apiSharedTypesTarget = path.join(apiNodeModules, 'shared-types');
// Também copiar para a raiz do backend (onde o Vercel pode procurar)
const rootNodeModules = path.join(__dirname, '../../node_modules/@falconi');
const rootSharedTypesTarget = path.join(rootNodeModules, 'shared-types');

console.log('🔍 Iniciando postbuild script...');
console.log('📁 sharedTypesDist:', sharedTypesDist);
console.log('📁 sharedTypesTarget:', sharedTypesTarget);
console.log('📁 apiSharedTypesTarget:', apiSharedTypesTarget);

if (!fs.existsSync(backendNodeModules)) {
  fs.mkdirSync(backendNodeModules, { recursive: true });
}

function removeRecursive(dir) {
  if (fs.existsSync(dir)) {
    const stats = fs.statSync(dir);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        removeRecursive(path.join(dir, file));
      });
      fs.rmdirSync(dir);
    } else {
      fs.unlinkSync(dir);
    }
  }
}

if (fs.existsSync(sharedTypesTarget)) {
  removeRecursive(sharedTypesTarget);
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(sharedTypesDist)) {
  // Copiar para node_modules do backend (para desenvolvimento local)
  copyRecursive(sharedTypesDist, sharedTypesTarget);
  
  const packageJson = {
    name: '@falconi/shared-types',
    version: '1.0.0',
    main: 'index.js',
    types: 'index.d.ts'
  };
  
  fs.writeFileSync(
    path.join(sharedTypesTarget, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Copiar também para api/node_modules (para garantir inclusão no bundle do Vercel)
  if (!fs.existsSync(apiNodeModules)) {
    fs.mkdirSync(apiNodeModules, { recursive: true });
  }
  
  if (fs.existsSync(apiSharedTypesTarget)) {
    removeRecursive(apiSharedTypesTarget);
  }
  
  copyRecursive(sharedTypesDist, apiSharedTypesTarget);
  fs.writeFileSync(
    path.join(apiSharedTypesTarget, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Copiar para node_modules da raiz do monorepo (fallback)
  if (!fs.existsSync(rootNodeModules)) {
    fs.mkdirSync(rootNodeModules, { recursive: true });
  }
  
  if (fs.existsSync(rootSharedTypesTarget)) {
    removeRecursive(rootSharedTypesTarget);
  }
  
  copyRecursive(sharedTypesDist, rootSharedTypesTarget);
  fs.writeFileSync(
    path.join(rootSharedTypesTarget, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('✅ @falconi/shared-types copiado para:');
  console.log('   - node_modules/@falconi/shared-types (backend)');
  console.log('   - api/node_modules/@falconi/shared-types (api)');
  console.log('   - ../../node_modules/@falconi/shared-types (raiz)');
  
  // Verificar se os arquivos foram copiados corretamente
  const checkFiles = ['index.js', 'index.d.ts', 'package.json'];
  let allFilesExist = true;
  
  checkFiles.forEach(file => {
    const backendFile = path.join(sharedTypesTarget, file);
    const apiFile = path.join(apiSharedTypesTarget, file);
    const backendExists = fs.existsSync(backendFile);
    const apiExists = fs.existsSync(apiFile);
    
    console.log(`  ${backendExists ? '✅' : '❌'} backend: ${file}`);
    console.log(`  ${apiExists ? '✅' : '❌'} api: ${file}`);
    
    if (!backendExists || !apiExists) {
      allFilesExist = false;
    }
  });
  
  if (!allFilesExist) {
    console.error('❌ Alguns arquivos não foram copiados corretamente!');
    process.exit(1);
  }
} else {
  console.error('❌ shared-types/dist não encontrado!');
  console.error('Caminho esperado:', sharedTypesDist);
  console.error('Diretório atual:', __dirname);
  process.exit(1);
}

