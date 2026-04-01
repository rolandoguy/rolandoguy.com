'use strict';

/**
 * Safe public build orchestrator.
 *
 * Purpose:
 * - Ensure generated public data and prerender always run together for deploy.
 * - Fail fast when admin export path is missing, so stale generated data is not deployed by accident.
 *
 * Usage:
 *   node scripts/build-public-safe.js --export path/to/rg_admin_export.json
 *   RG_ADMIN_EXPORT=path/to/rg_admin_export.json node scripts/build-public-safe.js
 */

var cp = require('child_process');
var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');

function parseExportArg(argv) {
  for (var i = 0; i < argv.length; i++) {
    if (argv[i] === '--export' && argv[i + 1]) return argv[i + 1];
  }
  return null;
}

function usageAndExit(msg) {
  if (msg) console.error(msg);
  console.error('');
  console.error('Usage: npm run build -- --export path/to/rg_admin_export.json');
  console.error('   or: RG_ADMIN_EXPORT=path/to/rg_admin_export.json npm run build');
  console.error('');
  console.error('If you intentionally only need prerender from current generated data, use:');
  console.error('  npm run build:public:quick');
  process.exit(1);
}

function run(cmd, args) {
  var full = cmd + ' ' + args.join(' ');
  console.log('\n[build-public] ' + full);
  var res = cp.spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env
  });
  if (res.error) {
    console.error('[build-public] Failed to run command:', full);
    console.error(String(res.error && res.error.message ? res.error.message : res.error));
    process.exit(1);
  }
  if (res.status !== 0) process.exit(res.status || 1);
}

var cliExport = parseExportArg(process.argv.slice(2));
var envExport = process.env.RG_ADMIN_EXPORT;
var exportPath = cliExport || envExport;
if (!exportPath) usageAndExit('Missing admin export path.');

var absExport = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
if (!fs.existsSync(absExport)) usageAndExit('Export file not found: ' + absExport);

var relOrAbs = path.isAbsolute(exportPath) ? absExport : exportPath;

[
  'build:epk-bios',
  'build:mp-locales',
  'build:hero-config',
  'build:mp-home',
  'build:biography',
  'build:repertoire',
  'build:calendar',
  'build:press',
  'build:media',
  'build:contact'
].forEach(function (scriptName) {
  run('npm', ['run', scriptName, '--', relOrAbs]);
});

run('npm', ['run', 'build:prerender-public']);
console.log('\n[build-public] Done. Generated data + prerender are ready for deploy.');
