'use strict';

/**
 * Safe public build orchestrator.
 *
 * Purpose:
 * - Ensure generated public data, checks, and prerender always run together for deploy.
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
var BUILD_STEPS = [
  { label: 'EPK bios bundle', script: 'build:epk-bios' },
  { label: 'Locale table bundle', script: 'build:mp-locales' },
  { label: 'Hero config bundle', script: 'build:hero-config' },
  { label: 'Home data bundle', script: 'build:mp-home' },
  { label: 'Biography data bundle', script: 'build:biography' },
  { label: 'Repertoire data bundle', script: 'build:repertoire' },
  { label: 'Programs data bundle', script: 'build:programs' },
  { label: 'Calendar data bundle', script: 'build:calendar' },
  { label: 'Press data bundle', script: 'build:press' },
  { label: 'Media data bundle', script: 'build:media' },
  { label: 'Contact data bundle', script: 'build:contact' },
  { label: 'Public smoke check', script: 'check:public-smoke', noExportArg: true },
  { label: 'Prerender public HTML', script: 'build:prerender-public', noExportArg: true }
];

function parseExportArg(argv) {
  for (var i = 0; i < argv.length; i++) {
    if (argv[i] === '--export' && argv[i + 1]) return argv[i + 1];
  }
  return null;
}

function usageAndExit(msg) {
  if (msg) console.error(msg);
  console.error('');
  console.error('Usage: npm run rebuild:public -- --export path/to/rg_admin_export.json');
  console.error('   or: npm run build -- --export path/to/rg_admin_export.json');
  console.error('   or: RG_ADMIN_EXPORT=path/to/rg_admin_export.json npm run rebuild:public');
  console.error('');
  console.error('If you intentionally only need prerender from current generated data, use:');
  console.error('  npm run build:public:quick');
  process.exit(1);
}

function run(cmd, args, label) {
  var full = cmd + ' ' + args.join(' ');
  console.log('\n[build-public] ' + (label || full));
  console.log('[build-public] $ ' + full);
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
  if (res.status !== 0) {
    console.error('[build-public] Step failed:', label || full);
    process.exit(res.status || 1);
  }
  console.log('[build-public] OK:', label || full);
}

var cliExport = parseExportArg(process.argv.slice(2));
var envExport = process.env.RG_ADMIN_EXPORT;
var exportPath = cliExport || envExport;
if (!exportPath) usageAndExit('Missing admin export path.');

var absExport = path.isAbsolute(exportPath) ? exportPath : path.join(root, exportPath);
if (!fs.existsSync(absExport)) usageAndExit('Export file not found: ' + absExport);

var relOrAbs = path.isAbsolute(exportPath) ? absExport : exportPath;
console.log('[build-public] Starting canonical public-site rebuild');
console.log('[build-public] Export source:', absExport);
console.log('[build-public] Steps:', BUILD_STEPS.map(function (step) { return step.script; }).join(', '));
console.log('[build-public] Note: admin changes do not reach the public site until you export, rebuild, and deploy.');
console.log('[build-public] Note: bundled v1-assets/data/*.json files are the public website source of truth.');

BUILD_STEPS.forEach(function (step, idx) {
  var args = ['run', step.script];
  if (!step.noExportArg) args.push('--', relOrAbs);
  run('npm', args, 'Step ' + (idx + 1) + '/' + BUILD_STEPS.length + ' · ' + step.label);
});
console.log('\n[build-public] Done. Public data regenerated, smoke-checked, and prerendered.');
console.log('[build-public] Reminder: public changes go live only after deploy.');
console.log('[build-public] Ready for deploy.');
