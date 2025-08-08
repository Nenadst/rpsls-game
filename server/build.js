import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

function convertTsImports(dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      convertTsImports(fullPath);
    } else if (file.endsWith('.ts')) {
      let content = readFileSync(fullPath, 'utf8');
      content = content.replace(/from ['"](.+)\.ts['"]/g, "from '$1.js'");
      content = content.replace(/import ['"](.+)\.ts['"]/g, "import '$1.js'");
      writeFileSync(fullPath, content);
    }
  }
}

function revertTsImports(dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      revertTsImports(fullPath);
    } else if (file.endsWith('.ts')) {
      let content = readFileSync(fullPath, 'utf8');
      content = content.replace(/from ['"](.+)\.js['"]/g, "from '$1.ts'");
      content = content.replace(/import ['"](.+)\.js['"]/g, "import '$1.ts'");
      writeFileSync(fullPath, content);
    }
  }
}

const srcDir = join(__dirname, 'src');

try {
  console.log('Converting .ts imports to .js for build...');
  convertTsImports(srcDir);
  
  console.log('Building with TypeScript...');
  execSync('tsc -p tsconfig.build.json', { stdio: 'inherit' });
  
  console.log('Build complete!');
} finally {
  console.log('Reverting imports back to .ts...');
  revertTsImports(srcDir);
}