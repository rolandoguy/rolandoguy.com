'use strict';
/**
 * Admin v3 - Validation and Helper Functions
 *
 * Purpose: Provide validation helpers and relationship query functions.
 * This is internal groundwork only and does not touch production admin-v2 flows.
 */

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function validateEntity(entity, schema, requiredFields, enums) {
  var errors = [];
  
  // Check required fields
  requiredFields.forEach(function (field) {
    if (!entity[field]) {
      errors.push(field + ' is required');
    }
  });
  
  // Check enum values
  if (enums) {
    Object.keys(enums).forEach(function (field) {
      var value = entity[field];
      if (value && enums[field].indexOf(value) === -1) {
        errors.push(field + ' must be one of: ' + enums[field].join(', '));
      }
    });
  }
  
  // Check field types
  Object.keys(schema).forEach(function (field) {
    var expectedType = schema[field];
    var value = entity[field];
    
    if (value === null || value === undefined || value === '') {
      return; // Skip empty values
    }
    
    if (expectedType === 'number' && typeof value !== 'number') {
      errors.push(field + ' must be a number');
    }
    
    if (expectedType === 'boolean' && typeof value !== 'boolean') {
      errors.push(field + ' must be a boolean');
    }
    
    if (expectedType === 'array' && !Array.isArray(value)) {
      errors.push(field + ' must be an array');
    }
  });
  
  return errors;
}

function validateCase(entity, enums) {
  var schemas = typeof window !== 'undefined' ? window.adminV3Schemas : require('./admin-v3-schemas');
  return validateEntity(entity, schemas.cases, schemas.casesRequired, enums || schemas.casesEnums);
}

function validateContact(entity, enums) {
  var schemas = typeof window !== 'undefined' ? window.adminV3Schemas : require('./admin-v3-schemas');
  return validateEntity(entity, schemas.contacts, schemas.contactsRequired, enums || schemas.contactsEnums);
}

function validateVenue(entity, enums) {
  var schemas = typeof window !== 'undefined' ? window.adminV3Schemas : require('./admin-v3-schemas');
  return validateEntity(entity, schemas.venues, schemas.venuesRequired, enums || schemas.venuesEnums);
}

function validateCalendarEvent(entity, enums) {
  var schemas = typeof window !== 'undefined' ? window.adminV3Schemas : require('./admin-v3-schemas');
  return validateEntity(entity, schemas.calendar, schemas.calendarRequired, enums || schemas.calendarEnums);
}

function validateIncome(entity, enums) {
  var schemas = typeof window !== 'undefined' ? window.adminV3Schemas : require('./admin-v3-schemas');
  return validateEntity(entity, schemas.income, schemas.incomeRequired, enums || schemas.incomeEnums);
}

// ─────────────────────────────────────────────────────────────────────────────
// DATE FORMATTING HELPER
// ─────────────────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return '';
  var date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // Return original if invalid
  
  var day = String(date.getDate()).padStart(2, '0');
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var year = date.getFullYear();
  
  return day + '.' + month + '.' + year;
}

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONSHIP HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getCasesByVenue(cases, venueId) {
  if (!cases || !Array.isArray(cases)) return [];
  return cases.filter(function (c) {
    return c.linked_venue_id === venueId;
  });
}

function getCasesByContact(cases, contactId) {
  if (!cases || !Array.isArray(cases)) return [];
  return cases.filter(function (c) {
    return c.linked_contact_ids && c.linked_contact_ids.indexOf(contactId) >= 0;
  });
}

function getContactsByVenue(contacts, venueId) {
  if (!contacts || !Array.isArray(contacts)) return [];
  return contacts.filter(function (c) {
    return c.linked_venue_id === venueId;
  });
}

function getCalendarByVenue(calendar, venueId) {
  if (!calendar || !Array.isArray(calendar)) return [];
  return calendar.filter(function (e) {
    return e.venue_id === venueId;
  });
}

function getCalendarByCase(calendar, caseId) {
  if (!calendar || !Array.isArray(calendar)) return [];
  return calendar.filter(function (e) {
    return e.linked_case_id === caseId;
  });
}

function getIncomeByCase(income, caseId) {
  if (!income || !Array.isArray(income)) return [];
  return income.filter(function (i) {
    return i.linked_case_id === caseId;
  });
}

function getIncomeByCalendar(income, calendarId) {
  if (!income || !Array.isArray(income)) return [];
  return income.filter(function (i) {
    return i.linked_calendar_id === calendarId;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function clone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(clone);
  return JSON.parse(JSON.stringify(obj));
}

function isObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function safeString(v) {
  if (v === null || v === undefined) return '';
  return String(v);
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  window.adminV3Helpers = {
    validateEntity: validateEntity,
    validateCase: validateCase,
    validateContact: validateContact,
    validateVenue: validateVenue,
    validateCalendarEvent: validateCalendarEvent,
    validateIncome: validateIncome,
    getCasesByVenue: getCasesByVenue,
    getCasesByContact: getCasesByContact,
    getContactsByVenue: getContactsByVenue,
    getCalendarByVenue: getCalendarByVenue,
    getCalendarByCase: getCalendarByCase,
    getIncomeByCase: getIncomeByCase,
    getIncomeByCalendar: getIncomeByCalendar,
    clone: clone,
    isObject: isObject,
    safeString: safeString
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateEntity: validateEntity,
    validateCase: validateCase,
    validateContact: validateContact,
    validateVenue: validateVenue,
    validateCalendarEvent: validateCalendarEvent,
    validateIncome: validateIncome,
    getCasesByVenue: getCasesByVenue,
    getCasesByContact: getCasesByContact,
    getContactsByVenue: getContactsByVenue,
    getCalendarByVenue: getCalendarByVenue,
    getCalendarByCase: getCalendarByCase,
    getIncomeByCase: getIncomeByCase,
    getIncomeByCalendar: getIncomeByCalendar,
    clone: clone,
    isObject: isObject,
    safeString: safeString
  };
}
