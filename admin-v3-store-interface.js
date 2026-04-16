'use strict';
/**
 * Admin v3 - Firestore Store Interface
 *
 * Purpose: Wire admin-v3 entities to Firestore REST API with isolated auth.
 * Uses same Firestore REST pattern as admin-v2 but separate document keys.
 *
 * Data model: One Firestore document per entity type containing a records array.
 * Document path: /rg/admin_v3_cases, /rg/admin_v3_contacts, etc.
 * Document format: { meta: {...}, records: [{ id: "...", ... }] }
 * Each record in the records array is an entity instance.
 *
 * This module does NOT touch production admin-v2 flows. It is isolated.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

var STORE_CONFIG = {
  projectId: 'rolandoguy-57d63',
  firestoreBase: 'https://firestore.googleapis.com/v1/projects/rolandoguy-57d63/databases/(default)/documents',
  collectionPath: 'rg', // Use same base as admin-v2
  entities: ['cases', 'contacts', 'venues', 'calendar', 'income'],
  entityPrefix: 'admin_v3_' // Prefix to distinguish admin-v3 documents
};

// ─────────────────────────────────────────────────────────────────────────────
// FIRESTORE REST API HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getEntityDocUrl(collection) {
  // Returns the URL for the entity document (e.g., /rg/admin_v3_cases)
  // The entity document contains a records array with all entity instances
  var docKey = STORE_CONFIG.entityPrefix + collection;
  return STORE_CONFIG.firestoreBase + '/' + STORE_CONFIG.collectionPath + '/' + encodeURIComponent(docKey);
}

function getFirestoreCollectionUrl(collection) {
  // For listing, we need to query by prefix. Firestore REST doesn't support prefix queries directly,
  // so we'll use the base collection and filter in memory for now.
  // This is a limitation of the flat structure with REST API.
  return STORE_CONFIG.firestoreBase + '/' + STORE_CONFIG.collectionPath;
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
    console.error('[admin-v3-store] Failed to parse Firestore doc:', e);
    return null;
  }
}

function safeString(v) {
  if (v === null || v === undefined) return '';
  return String(v);
}

function clone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(clone);
  return JSON.parse(JSON.stringify(obj));
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH TOKEN FETCH
// ─────────────────────────────────────────────────────────────────────────────

function getAuthIdToken() {
  var auth = typeof window !== 'undefined' && window.adminV3Auth ? window.adminV3Auth : null;
  if (!auth) return Promise.resolve('');
  return auth.getIdToken();
}

// ─────────────────────────────────────────────────────────────────────────────
// PER-ENTITY CACHE (small, isolated)
// ─────────────────────────────────────────────────────────────────────────────

var entityCache = {};

function getCache(collection) {
  if (!entityCache[collection]) {
    entityCache[collection] = {};
  }
  return entityCache[collection];
}

function setCache(collection, docId, doc) {
  if (!entityCache[collection]) {
    entityCache[collection] = {};
  }
  entityCache[collection][docId] = doc;
}

function clearCache(collection) {
  if (collection) {
    entityCache[collection] = {};
  } else {
    entityCache = {};
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTITY STORE
// ─────────────────────────────────────────────────────────────────────────────

function createEntityStore(collection) {
  if (STORE_CONFIG.entities.indexOf(collection) === -1) {
    throw new Error('Invalid entity type: ' + collection);
  }

  return {
    getAll: function () {
      var url = getFirestoreCollectionUrl(collection);
      var expectedDocKey = STORE_CONFIG.entityPrefix + collection;
      return getAuthIdToken().then(function (token) {
        if (!token) {
          throw new Error('No auth token available');
        }

        return fetch(url + '?pageSize=500', {
          cache: 'no-store',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(function (r) {
          if (!r.ok) {
            if (r.status === 404) return []; // Collection not found is ok
            throw new Error('Firestore list failed: ' + r.status + ' ' + r.statusText);
          }
          return r.json();
        }).then(function (json) {
          if (!json || !json.documents) return [];
          var cache = getCache(collection);
          return json.documents.map(function (doc) {
            var docName = doc.name;
            var docKey = docName.split('/').pop();
            // Filter to only the entity document (e.g., admin_v3_cases)
            if (docKey !== expectedDocKey) return null;
            var parsed = parseFirestoreDocJson(doc);
            if (parsed && Array.isArray(parsed.records)) {
              // Return the records array (each record is an entity instance)
              return parsed.records.map(function (record) {
                cache[record.id] = record;
                return record;
              });
            }
            return null;
          }).filter(Boolean).flat();
        });
      });
    },

    getById: function (id) {
      if (!id) return Promise.resolve(null);
      
      // Check cache first
      var cache = getCache(collection);
      if (cache[id]) {
        return Promise.resolve(clone(cache[id]));
      }

      var expectedDocKey = STORE_CONFIG.entityPrefix + collection;
      var url = getEntityDocUrl(collection);
      return getAuthIdToken().then(function (token) {
        if (!token) {
          throw new Error('No auth token available');
        }

        return fetch(url, {
          cache: 'no-store',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(function (r) {
          if (!r.ok) {
            if (r.status === 404) return null; // Document not found is ok
            throw new Error('Firestore load failed: ' + r.status + ' ' + r.statusText);
          }
          return r.json();
        }).then(function (doc) {
          if (!doc) return null;
          var parsed = parseFirestoreDocJson(doc);
          if (!parsed || !Array.isArray(parsed.records)) return null;
          
          // Find the record by id
          // Normalize id to string for consistent comparison (handles string/number mismatch)
          var normalizedId = String(id);
          var index = parsed.records.findIndex(function (r) { return String(r.id) === normalizedId; });
          if (index < 0) {
            return null;
          }
          var record = parsed.records[index];
          setCache(collection, id, record);
          return record;
        });
      });
    },

    insert: function (doc) {
      if (!doc || !doc.id) {
        return Promise.reject(new Error('Document must have id'));
      }

      var expectedDocKey = STORE_CONFIG.entityPrefix + collection;
      var url = getEntityDocUrl(collection);

      // Fetch the entity document, add the record to the records array, and save
      return getAuthIdToken().then(function (token) {
        if (!token) {
          throw new Error('No auth token available');
        }

        // First, try to fetch existing document
        return fetch(url, {
          cache: 'no-store',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(function (r) {
          if (r.ok) {
            return r.json();
          }
          if (r.status === 404) {
            return null; // Document doesn't exist yet
          }
          throw new Error('Firestore load failed: ' + r.status + ' ' + r.statusText);
        }).then(function (existingDoc) {
          // Return both token and existingDoc to next .then()
          return { token: token, existingDoc: existingDoc };
        });
      }).then(function (result) {
        var token = result.token;
        var existingDoc = result.existingDoc;
        var payload;
        
        if (existingDoc) {
          var parsed = parseFirestoreDocJson(existingDoc);
          if (!parsed) {
            parsed = { meta: { version: 1 }, records: [] };
          }
          if (!Array.isArray(parsed.records)) {
            parsed.records = [];
          }
          // Check if record already exists
          var existingIndex = parsed.records.findIndex(function (r) { return r.id === doc.id; });
          if (existingIndex >= 0) {
            parsed.records[existingIndex] = doc;
          } else {
            parsed.records.push(doc);
          }
          parsed.meta.updatedAt = new Date().toISOString();
          payload = parsed;
        } else {
          // Create new document with records array
          payload = {
            meta: { version: 1, createdAt: new Date().toISOString() },
            records: [doc]
          };
        }
        
        var body = encodeFirestoreDocBody(payload);
        return fetch(url, {
          method: 'PATCH',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: body
        }).then(function (r) {
          if (!r.ok) {
            return r.text().then(function (text) {
              throw new Error('Firestore save failed: ' + r.status + ' ' + r.statusText + ' - ' + text);
            });
          }
          setCache(collection, doc.id, doc);
          return doc;
        });
      });
    },

    update: function (id, doc) {
      if (!id || !doc) {
        return Promise.reject(new Error('Document id and doc required'));
      }

      doc.id = id; // Ensure id is set
      var expectedDocKey = STORE_CONFIG.entityPrefix + collection;
      var url = getEntityDocUrl(collection);

      return getAuthIdToken().then(function (token) {
        if (!token) {
          throw new Error('No auth token available');
        }

        // Fetch the entity document
        return fetch(url, {
          cache: 'no-store',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(function (r) {
          if (r.ok) {
            return r.json();
          }
          throw new Error('Firestore load failed: ' + r.status + ' ' + r.statusText);
        }).then(function (existingDoc) {
          // Return both token and existingDoc to next .then()
          return { token: token, existingDoc: existingDoc };
        });
      }).then(function (result) {
        var token = result.token;
        var existingDoc = result.existingDoc;
        var parsed = parseFirestoreDocJson(existingDoc);
        if (!parsed || !Array.isArray(parsed.records)) {
          throw new Error('Invalid document structure');
        }
        
        // Update the record
        // Normalize id to string for consistent comparison (handles string/number mismatch)
        var normalizedId = String(id);
        var index = parsed.records.findIndex(function (r) { return String(r.id) === normalizedId; });
        if (index < 0) {
          throw new Error('Record not found');
        }
        parsed.records[index] = doc;
        parsed.meta.updatedAt = new Date().toISOString();
        
        var body = encodeFirestoreDocBody(parsed);
        return fetch(url, {
          method: 'PATCH',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: body
        }).then(function (r) {
          if (!r.ok) {
            return r.text().then(function (text) {
              throw new Error('Firestore save failed: ' + r.status + ' ' + r.statusText + ' - ' + text);
            });
          }
          setCache(collection, id, doc);
          return doc;
        });
      });
    },

    delete: function (id) {
      if (!id) {
        return Promise.reject(new Error('Document id required'));
      }

      var expectedDocKey = STORE_CONFIG.entityPrefix + collection;
      var url = getEntityDocUrl(collection);

      return getAuthIdToken().then(function (token) {
        if (!token) {
          throw new Error('No auth token available');
        }

        // Fetch the entity document, remove the record from records array, and save
        // This does NOT delete the whole Firestore document
        return fetch(url, {
          cache: 'no-store',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }).then(function (r) {
          if (r.ok) {
            return r.json();
          }
          throw new Error('Firestore load failed: ' + r.status + ' ' + r.statusText);
        }).then(function (existingDoc) {
          // Return both token and existingDoc to next .then()
          return { token: token, existingDoc: existingDoc };
        });
      }).then(function (result) {
        var token = result.token;
        var existingDoc = result.existingDoc;
        var parsed = parseFirestoreDocJson(existingDoc);
        if (!parsed || !Array.isArray(parsed.records)) {
          throw new Error('Invalid document structure');
        }
        
        // Remove the record from records array
        // Normalize id to string for consistent comparison (handles string/number mismatch)
        var normalizedId = String(id);
        var index = parsed.records.findIndex(function (r) { return String(r.id) === normalizedId; });
        if (index < 0) {
          throw new Error('Record not found');
        }
        parsed.records.splice(index, 1);
        parsed.meta.updatedAt = new Date().toISOString();
        
        var body = encodeFirestoreDocBody(parsed);
        return fetch(url, {
          method: 'PATCH',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: body
        }).then(function (r) {
          if (!r.ok) {
            return r.text().then(function (text) {
              throw new Error('Firestore save failed: ' + r.status + ' ' + r.statusText + ' - ' + text);
            });
          }
          var cache = getCache(collection);
          delete cache[id];
          return true;
        });
      });
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE FACTORY
// ─────────────────────────────────────────────────────────────────────────────

function createFirestoreStore() {
  return {
    cases: createEntityStore('cases'),
    contacts: createEntityStore('contacts'),
    venues: createEntityStore('venues'),
    calendar: createEntityStore('calendar'),
    income: createEntityStore('income'),
    clearCache: clearCache
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  window.adminV3StoreInterface = {
    createFirestoreStore: createFirestoreStore,
    createEntityStore: createEntityStore,
    config: STORE_CONFIG
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createFirestoreStore: createFirestoreStore,
    createEntityStore: createEntityStore,
    config: STORE_CONFIG
  };
}
