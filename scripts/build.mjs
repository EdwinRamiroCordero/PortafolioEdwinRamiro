// Compila los 6 proyectos y publica el resultado estático en la raíz del repositorio
// (lista para GitHub Pages: index.html + assets/ + proyectos/<sitio>/).
import { execSync } from 'node:child_process';
import { cpSync, rmSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'codigo-fuente');
const sitios = ['altura-propiedades', 'kapital-ya', 'egida-seguros', 'tributa', 'forja-fix-flip'];
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

for (const p of [...sitios, 'portafolio']) {
  const dir = join(src, p);
  console.log(`\n▶ ${p}`);
  if (!existsSync(join(dir, 'node_modules'))) run('npm install', dir);
  run('npm run build', dir);
}

rmSync(join(root, 'proyectos'), { recursive: true, force: true });
rmSync(join(root, 'assets'), { recursive: true, force: true });
for (const s of sitios) {
  mkdirSync(join(root, 'proyectos', s), { recursive: true });
  cpSync(join(src, s, 'dist'), join(root, 'proyectos', s), { recursive: true });
}
cpSync(join(src, 'portafolio', 'dist'), root, { recursive: true });
writeFileSync(join(root, '.nojekyll'), '');
console.log('\n✔ Listo. Sube los cambios a GitHub y GitHub Pages publicará el sitio.');
