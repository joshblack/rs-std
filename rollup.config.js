'use strict';

const fs = require('fs');
const path = require('path');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const typescript = require('rollup-plugin-typescript2');
const packageJson = require('./package.json');

const input = walk(path.join(__dirname, 'src'));
const loaded = new Set();

const inputOptions = {
  input,
  external: [
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
  ],
  plugins: [
    nodeResolve(),
    commonjs({
      include: /node_modules/,
    }),
    typescript(),
    {
      id: 'generate-package-details',
      generateBundle(outputOptions, bundle) {
        for (const value of Object.values(bundle)) {
          if (!value.facadeModuleId) {
            continue;
          }

          if (loaded.has(value.facadeModuleId)) {
            continue;
          }

          loaded.add(value.facadeModuleId);

          const { fileName } = value;
          const directory = path.dirname(fileName);
          const packageJsonPath = path.join(directory, 'package.json');
          const types = path.basename(path.dirname(packageJsonPath));
          const packageJson = {
            main: './index.js',
            module: './index.mjs',
            types: `../${types}.d.ts`,
            sideEffects: false,
          };

          this.emitFile({
            type: 'asset',
            fileName: packageJsonPath,
            source: JSON.stringify(packageJson),
          });
        }
      },
    },
  ],
};

module.exports = [
  {
    ...inputOptions,
    output: {
      dir: 'modules',
      entryFileNames: '[name]/index.mjs',
      exports: 'named',
      format: 'esm',
    },
  },
  {
    ...inputOptions,
    output: {
      dir: 'modules',
      entryFileNames: '[name]/index.js',
      exports: 'named',
      format: 'commonjs',
    },
  },
];

function walk(directory, rootDir = directory) {
  const filenames = fs.readdirSync(directory);
  const files = {};

  for (const filename of filenames) {
    const filepath = path.join(directory, filename);
    const stats = fs.statSync(filepath);

    if (stats.isDirectory()) {
      for (const [key, value] of Object.entries(walk(filepath, rootDir))) {
        files[key] = value;
      }
      continue;
    }

    if (path.extname(filepath) !== '.ts') {
      continue;
    }

    const key = path.relative(rootDir, filepath).replace(/\.ts$/, '');

    files[key] = filepath;
  }

  return files;
}
