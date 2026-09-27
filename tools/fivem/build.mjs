import { build } from 'esbuild';
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const resourcesRoot = join(root, 'packages', 'resources');
const outRoot = join(root, 'dist', 'fivem', 'resources');
const devMode = process.argv.includes('--dev');
const devResources = join(root, 'fivem-dev', 'resources');

const packageAliases = {
  '@revolt-rp/common': 'common',
  '@revolt-rp/core': 'core',
  '@revolt-rp/api-contract': 'api-contract',
  '@revolt-rp/api-client': 'api-client',
  '@revolt-rp/game-abstraction': 'game-abstraction',
  '@revolt-rp/game-kernel': 'game-kernel',
  '@revolt-rp/platform-fivem': 'platform-fivem'
};

const aliasPlugin = {
  name: 'revolt-alias',
  setup(buildContext) {
    buildContext.onResolve({ filter: /^@revolt-rp\// }, (args) => {
      const packageName = packageAliases[args.path];

      if (!packageName) {
        return null;
      }

      return { path: join(root, 'packages', packageName, 'src', 'index.ts') };
    });
  }
};

const buildManifest = (config) => {
  const lines = [
    "fx_version 'cerulean'",
    "game 'gta5'",
    '',
    `author '${config.author}'`,
    `description '${config.description}'`,
    `version '${config.version}'`,
    ''
  ];

  if (config.nodeVersion) {
    lines.push(`node_version '${config.nodeVersion}'`, '');
  }

  if (config.server) {
    lines.push('server_scripts {', "  'server/main.js'", '}', '');
  }

  if (config.client) {
    lines.push('client_scripts {', "  'client/main.js'", '}', '');
  }

  if (config.dependencies?.length) {
    lines.push('dependencies {');
    for (const dependency of config.dependencies) {
      lines.push(`  '${dependency}'`);
    }
    lines.push('}', '');
  }

  return lines.join('\n');
};

const buildResource = async (resourceName) => {
  const resourceDir = join(resourcesRoot, resourceName);
  const configUrl = pathToFileURL(join(resourceDir, 'resource.config.mjs')).href;
  const { default: config } = await import(configUrl);

  const outDir = join(outRoot, config.name);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  if (config.server) {
    await build({
      entryPoints: [join(resourceDir, config.server)],
      outfile: join(outDir, 'server', 'main.js'),
      bundle: true,
      platform: 'node',
      format: 'cjs',
      target: 'node22',
      plugins: [aliasPlugin],
      logLevel: 'warning'
    });
  }

  if (config.client) {
    await build({
      entryPoints: [join(resourceDir, config.client)],
      outfile: join(outDir, 'client', 'main.js'),
      bundle: true,
      platform: 'browser',
      format: 'iife',
      target: 'es2020',
      plugins: [aliasPlugin],
      logLevel: 'warning'
    });
  }

  writeFileSync(join(outDir, 'fxmanifest.lua'), buildManifest(config), 'utf8');

  if (devMode) {
    const devOutDir = join(devResources, config.name);
    cpSync(outDir, devOutDir, { recursive: true });
  }

  console.log(`[fivem] built ${config.name} (${config.server ?? '-'} / ${config.client ?? '-'})`);
};

const resourceNames = readdirSync(resourcesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
  .map((entry) => entry.name);

for (const resourceName of resourceNames) {
  await buildResource(resourceName);
}

console.log(`[fivem] done — output: ${outRoot}${devMode ? ` + ${devResources}` : ''}`);
