'use strict';
/**
 * Admin v3 - Entity Factories
 *
 * Purpose: Create default entity instances with proper field initialization.
 * This is internal groundwork only and does not touch production admin-v2 flows.
 */

// ─────────────────────────────────────────────────────────────────────────────
// ID GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

function generateId(prefix) {
  prefix = prefix || 'ent';
  var timestamp = Date.now().toString(36);
  var random = Math.random().toString(36).substring(2, 11);
  return prefix + '_' + timestamp + '_' + random;
}

function generateCaseId() {
  return generateId('case');
}

function generateContactId() {
  return generateId('contact');
}

function generateVenueId() {
  return generateId('venue');
}

function generateCalendarId() {
  return generateId('event');
}

function generateIncomeId() {
  return generateId('income');
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTITY FACTORIES
// ─────────────────────────────────────────────────────────────────────────────

function createCase(overrides) {
  var now = new Date().toISOString();
  return Object.assign({
    id: generateCaseId(),
    title: '',
    opportunity_type: 'other',
    proposal_format: 'email',
    source: '',
    origin_channel: '',
    status: 'lead',
    priority: 'medium',
    probability: 0,
    linked_venue_id: '',
    linked_contact_ids: [],
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    venue_name: '',
    venue_city: '',
    venue_address_or_url: '',
    estimated_fee: 0,
    estimated_currency: 'EUR',
    estimated_travel_cost: 0,
    estimated_hotel_cost: 0,
    expected_total_value: 0,
    decision_deadline: '',
    discussed_date: '',
    proposed_date: '',
    next_followup_date: '',
    last_contact_at: '',
    description: '',
    proposed_program: '',
    next_action: '',
    notes_internal: '',
    created_at: now,
    updated_at: now
  }, overrides || {});
}

function createContact(overrides) {
  var now = new Date().toISOString();
  return Object.assign({
    id: generateContactId(),
    full_name: '',
    role: '',
    organization: '',
    email: '',
    phone: '',
    whatsapp: '',
    city: '',
    country: '',
    preferred_language: 'en',
    linked_venue_id: '',
    contact_status: 'active',
    relationship_strength: 'new',
    warmth_level: 'cold',
    instagram: '',
    facebook: '',
    website: '',
    last_contact_at: '',
    next_followup_date: '',
    notes_internal: '',
    created_at: now,
    updated_at: now
  }, overrides || {});
}

function createVenue(overrides) {
  var now = new Date().toISOString();
  return Object.assign({
    id: generateVenueId(),
    name: '',
    venue_type: 'other',
    city: '',
    country: '',
    address: '',
    capacity: 0,
    audience_type: 'general',
    programming_profile: 'balanced',
    relationship_status: 'prospect',
    strategic_value: 'target',
    budget_level: 'unknown',
    priority_score: 50,
    fits_tango: false,
    fits_classical: false,
    fits_private_events: false,
    fits_crossover: false,
    notes_internal: '',
    created_at: now,
    updated_at: now
  }, overrides || {});
}

function createCalendarEvent(overrides) {
  var now = new Date().toISOString();
  return Object.assign({
    id: generateCalendarId(),
    title: '',
    event_type: 'concert',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    all_day: false,
    timezone: '',
    venue: '',
    venue_id: '',
    city: '',
    linked_case_id: '',
    status: 'tentative',
    expected_income: null,
    currency: 'EUR',
    public_visibility: 'public',
    public_calendar_readiness: 'not_ready',
    confirmed_on: '',
    series: '',
    project: '',
    format: '',
    artists: [],
    audience_estimate: 0,
    fee_status: 'pending_confirmation',
    payment_model: 'not_yet_defined',
    pending_items: [],
    next_action: '',
    follow_up_due: '',
    program: '',
    notes_internal: '',
    notes_public: '',
    source_system: '',
    source_id: '',
    migrated_at: '',
    created_at: now,
    updated_at: now
  }, overrides || {});
}

function createIncome(overrides) {
  var now = new Date().toISOString();
  return Object.assign({
    id: generateIncomeId(),
    title: '',
    income_type: 'performance_fee',
    amount: 0,
    currency: 'EUR',
    status: 'expected',
    linked_case_id: '',
    linked_calendar_id: '',
    invoice_date: '',
    due_date: '',
    paid_date: '',
    notes_internal: '',
    source_system: '',
    source_id: '',
    migrated_at: '',
    created_at: now,
    updated_at: now
  }, overrides || {});
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  window.adminV3Factories = {
    generateId: generateId,
    generateCaseId: generateCaseId,
    generateContactId: generateContactId,
    generateVenueId: generateVenueId,
    generateCalendarId: generateCalendarId,
    generateIncomeId: generateIncomeId,
    createCase: createCase,
    createContact: createContact,
    createVenue: createVenue,
    createCalendarEvent: createCalendarEvent,
    createIncome: createIncome
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateId: generateId,
    generateCaseId: generateCaseId,
    generateContactId: generateContactId,
    generateVenueId: generateVenueId,
    generateCalendarId: generateCalendarId,
    generateIncomeId: generateIncomeId,
    createCase: createCase,
    createContact: createContact,
    createVenue: createVenue,
    createCalendarEvent: createCalendarEvent,
    createIncome: createIncome
  };
}
