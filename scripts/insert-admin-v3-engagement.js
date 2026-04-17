#!/usr/bin/env node
'use strict';
/**
 * Insert Tango Tenors Engagement into Admin v3 Calendar
 *
 * This script inserts the internal engagement record directly into the admin-v3
 * Firestore storage via the admin-v3 store interface.
 *
 * Usage: node scripts/insert-admin-v3-engagement.js
 *
 * This script requires Firebase authentication tokens from an active admin-v2 session.
 * It will prompt you to provide the auth token or use a token from admin-v2 export.
 */

var https = require('https');
var http = require('http');

// Firestore configuration
var FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/rolandoguy-57d63/databases/(default)/documents';
var COLLECTION_PATH = 'rg';
var DOC_KEY = 'admin_v3_calendar';

// Engagement record data
var engagementRecord = {
  id: 'event_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 11),
  title: 'Tango Tenors - Clärchens Ballhaus',
  event_type: 'engagement',
  start_date: '2026-06-07',
  end_date: '2026-06-07',
  all_day: true,
  timezone: 'Europe/Berlin',
  venue_id: '',
  linked_case_id: '',
  status: 'confirmed',
  expected_income: 0,
  currency: 'EUR',
  public_visibility: 'internal_only',
  public_calendar_readiness: 'pending_practical_details',
  confirmed_on: '2026-04-15',
  series: 'Musik der Welt im Spiegelsaal',
  project: 'Tango Tenors',
  format: 'duo recital',
  artists: ['Rolando Guy', 'Gaston Efficace'],
  audience_estimate: 150,
  fee_status: 'pending_confirmation',
  payment_model: 'not_yet_defined',
  pending_items: ['schedule', 'duration', 'technical_setup', 'piano_or_sound', 'promotion_link', 'payment_conditions', 'arrival_logistics'],
  next_action: 'wait_for_practical_details',
  follow_up_due: '2026-04-22',
  program: 'Argentine tango and Neapolitan canzonettas',
  notes_internal: 'Twinkle Yadav confirmed by email on 2026-04-15 that they are very happy to have Tango Tenors on June 7th. She stated that audience size for the series is usually around 150 people and that she would follow up shortly with the practical details. Contacts: Twinkle Yadav (organizer), Benjamin Wernicke (contact). Venue: Clärchens Ballhaus, Berlin, Germany.',
  notes_public: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

function getFirestoreDocUrl() {
  return FIRESTORE_BASE + '/' + COLLECTION_PATH + '/' + encodeURIComponent(DOC_KEY);
}

function encodeFirestoreDocBody(payload) {
  return JSON.stringify({
    fields: {
      value: {
        stringValue: JSON.stringify(payload)
      }
    }
  });
}

function parseFirestoreDocJson(doc) {
  if (!doc || !doc.fields || !doc.fields.value) return null;
  var raw = doc.fields.value.stringValue;
  if (!raw || typeof raw !== 'string') return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse Firestore doc:', e);
    return null;
  }
}

function httpsRequest(options, data) {
  return new Promise(function (resolve, reject) {
    var req = https.request(options, function (res) {
      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {
        try {
          var parsed = JSON.parse(body);
          resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, headers: res.headers, body: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

function insertEngagementRecord(authToken) {
  if (!authToken) {
    console.error('Error: No auth token provided. Please provide a Firebase auth token.');
    console.error('You can get this from admin-v2 by opening browser dev tools and running:');
    console.error('  firebase.auth().currentUser.getIdToken(true).then(console.log)');
    process.exit(1);
  }

  var url = getFirestoreDocUrl();
  var parsedUrl = require('url').parse(url);
  
  console.log('Fetching existing calendar document...');
  
  var fetchOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || 443,
    path: parsedUrl.path,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + authToken
    }
  };

  return httpsRequest(fetchOptions).then(function (res) {
    if (res.statusCode === 404) {
      console.log('Document does not exist yet, will create new document');
      return null;
    }
    if (res.statusCode !== 200) {
      throw new Error('Firestore fetch failed: ' + res.statusCode);
    }
    return parseFirestoreDocJson(res.body);
  }).then(function (existingDoc) {
    var payload;
    
    if (existingDoc) {
      if (!existingDoc.meta) existingDoc.meta = { version: 1 };
      if (!Array.isArray(existingDoc.records)) existingDoc.records = [];
      
      var existingIndex = existingDoc.records.findIndex(function (r) { return r.id === engagementRecord.id; });
      if (existingIndex >= 0) {
        console.log('Record with ID ' + engagementRecord.id + ' already exists, updating...');
        existingDoc.records[existingIndex] = engagementRecord;
      } else {
        console.log('Adding new record to existing document...');
        existingDoc.records.push(engagementRecord);
      }
      existingDoc.meta.updatedAt = new Date().toISOString();
      payload = existingDoc;
    } else {
      console.log('Creating new document with engagement record...');
      payload = {
        meta: { version: 1, createdAt: new Date().toISOString() },
        records: [engagementRecord]
      };
    }
    
    var body = encodeFirestoreDocBody(payload);
    var patchOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.path,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    console.log('Inserting engagement record into Firestore...');
    return httpsRequest(patchOptions, body);
  }).then(function (res) {
    if (res.statusCode !== 200) {
      throw new Error('Firestore save failed: ' + res.statusCode + ' ' + JSON.stringify(res.body));
    }
    console.log('✓ Engagement record inserted successfully!');
    console.log('✓ Record ID: ' + engagementRecord.id);
    console.log('✓ Title: ' + engagementRecord.title);
    console.log('✓ Storage location: /' + COLLECTION_PATH + '/' + DOC_KEY);
    console.log('');
    console.log('You can now view this record in admin-v3-calendar.html');
    return engagementRecord;
  });
}

// Main execution
var authToken = process.argv[2];
if (!authToken) {
  console.error('Usage: node scripts/insert-admin-v3-engagement.js <firebase-auth-token>');
  console.error('');
  console.error('To get your Firebase auth token:');
  console.error('1. Open admin-v2.html in your browser and sign in');
  console.error('2. Open browser dev tools (F12)');
  console.error('3. Run in console: firebase.auth().currentUser.getIdToken(true).then(console.log)');
  console.error('4. Copy the token and run this script with it');
  console.error('');
  console.error('Example: node scripts/insert-admin-v3-engagement.js "eyJhbGciOiJSUzI1NiIsImtpZCI6..."');
  process.exit(1);
}

insertEngagementRecord(authToken).catch(function (err) {
  console.error('Error:', err.message);
  process.exit(1);
});
