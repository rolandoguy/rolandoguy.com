'use strict';

var fs = require('fs');

function readJson(p, label) {
  if (!fs.existsSync(p)) {
    console.error((label || 'admin-export') + ': missing file', p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function pickExportSourcePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  if (payload.public && typeof payload.public === 'object' && !Array.isArray(payload.public)) {
    return payload.public;
  }
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return payload;
}

function loadAdminExportSource(p, label) {
  var payload = readJson(p, label);
  var source = pickExportSourcePayload(payload);
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    console.error((label || 'admin-export') + ': export missing usable source payload');
    process.exit(1);
  }
  return {
    payload: payload,
    source: source
  };
}

module.exports = {
  readJson: readJson,
  pickExportSourcePayload: pickExportSourcePayload,
  loadAdminExportSource: loadAdminExportSource
};
