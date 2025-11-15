/**
 * Script pós-build para garantir que @falconi/shared-types esteja disponível
 * Este script copia o shared-types compilado para node_modules após o build
 */
const fs = require('fs');
const path = require('path');

const sharedTypesDist = path.join(__dirname, '../../../packages/shared-types/dist');
const backendNodeModules = path.join(__dirname, '../node_modules/@falconi');
const sharedTypesTarget = path.join(backendNodeModules, 'shared-types');

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
  
  console.log('✅ @falconi/shared-types copiado para node_modules');
} else {
  console.error('❌ shared-types/dist não encontrado!');
  process.exit(1);
}

