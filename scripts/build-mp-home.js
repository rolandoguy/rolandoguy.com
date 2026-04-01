'use strict';
/**
 * Hero background config + mp locale strings for Home (hero copy, intro, explore).
 * Runs, in order: build-hero-config.js, build-mp-locales.js (same export).
 *
 * Usage:
 *   npm run build:mp-home -- path/to/rg_admin_export.json
 */

var cp = require('child_process');
var path = require('path');

var exportPath = process.argv[2];
if (!exportPath) {
  console.error('Usage: node scripts/build-mp-home.js <rg_admin_export.json>');
  process.exit(1);
}

var scriptsDir = __dirname;
var node = process.execPath;

function run(script) {
  var r = cp.spawnSync(node, [path.join(scriptsDir, script), exportPath], {
    stdio: 'inherit'
  });
  if (r.status !== 0) process.exit(r.status != null ? r.status : 1);
}

run('build-hero-config.js');
run('build-mp-locales.js');
