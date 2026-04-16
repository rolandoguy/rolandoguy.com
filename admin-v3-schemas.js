'use strict';
/**
 * Admin v3 - Entity Schema Definitions
 *
 * Purpose: Define the 5-entity architecture for admin-v3 in an isolated module.
 * This is internal groundwork only and does not touch production admin-v2 flows.
 *
 * Entities:
 * - Cases: Opportunity and negotiation tracking
 * - Contacts: People and communication tracking
 * - Venues: Places and strategic metadata
 * - Calendar: Operational agenda and events
 * - Income: Financial tracking and ledger
 */

// ─────────────────────────────────────────────────────────────────────────────
// CASES SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

var CASES_SCHEMA = {
  id: 'string',                    // Stable UUID
  title: 'string',                 // Case title
  opportunity_type: 'string',      // concert, recital, gala, teaching, masterclass, other
  proposal_format: 'string',       // email, formal_proposal, verbal, other
  source: 'string',                // Source of lead
  origin_channel: 'string',        // How the lead came in
  status: 'string',                // lead, qualified, negotiating, confirmed, declined, lost, archived
  priority: 'string',              // high, medium, low
  probability: 'number',           // 0-100
  linked_venue_id: 'string',      // Reference to Venues entity
  linked_contact_ids: 'array',     // Array of Contact entity IDs
  estimated_fee: 'number',         // Estimated fee amount
  estimated_currency: 'string',   // EUR, USD, GBP, CHF, ARS
  estimated_travel_cost: 'number',
  estimated_hotel_cost: 'number',
  expected_total_value: 'number',
  decision_deadline: 'string',    // ISO date string
  next_followup_date: 'string',   // ISO date string
  last_contact_at: 'string',       // ISO date string
  description: 'string',
  proposed_program: 'string',
  next_action: 'string',
  notes_internal: 'string',
  created_at: 'string',           // ISO date string
  updated_at: 'string'            // ISO date string
};

var CASES_REQUIRED_FIELDS = ['id', 'title'];

var CASES_ENUMS = {
  opportunity_type: ['concert', 'recital', 'gala', 'teaching', 'masterclass', 'other'],
  proposal_format: ['email', 'formal_proposal', 'verbal', 'other'],
  status: ['lead', 'qualified', 'negotiating', 'confirmed', 'declined', 'lost', 'archived'],
  priority: ['high', 'medium', 'low'],
  estimated_currency: ['EUR', 'USD', 'GBP', 'CHF', 'ARS']
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTACTS SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

var CONTACTS_SCHEMA = {
  id: 'string',                    // Stable UUID
  full_name: 'string',
  role: 'string',
  organization: 'string',
  email: 'string',
  phone: 'string',
  whatsapp: 'string',
  city: 'string',
  country: 'string',
  preferred_language: 'string',   // en, de, es, it, fr
  linked_venue_id: 'string',      // Reference to Venues entity
  contact_status: 'string',       // active, inactive, archived
  relationship_strength: 'string', // strong, medium, weak, new
  warmth_level: 'string',         // hot, warm, cold
  instagram: 'string',
  facebook: 'string',
  website: 'string',
  last_contact_at: 'string',      // ISO date string
  next_followup_date: 'string',   // ISO date string
  notes_internal: 'string',
  created_at: 'string',           // ISO date string
  updated_at: 'string'            // ISO date string
};

var CONTACTS_REQUIRED_FIELDS = ['id', 'full_name'];

var CONTACTS_ENUMS = {
  preferred_language: ['en', 'de', 'es', 'it', 'fr'],
  contact_status: ['active', 'inactive', 'archived'],
  relationship_strength: ['strong', 'medium', 'weak', 'new'],
  warmth_level: ['hot', 'warm', 'cold']
};

// ─────────────────────────────────────────────────────────────────────────────
// VENUES SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

var VENUES_SCHEMA = {
  id: 'string',                    // Stable UUID
  name: 'string',
  venue_type: 'string',           // concert_hall, church, festival, private, other
  city: 'string',
  country: 'string',
  address: 'string',
  website: 'string',
  instagram: 'string',
  capacity: 'number',
  audience_type: 'string',        // classical, mixed, general, other
  programming_profile: 'string',  // conservative, adventurous, balanced
  relationship_status: 'string', // active, past, prospect, dormant
  strategic_value: 'string',      // flagship, regular, occasional, target
  budget_level: 'string',         // high, medium, low, unknown
  fits_tango: 'boolean',
  fits_classical: 'boolean',
  fits_private_events: 'boolean',
  fits_crossover: 'boolean',
  seasonality: 'string',
  target_pitch: 'string',
  booking_window: 'string',
  typical_fee_range: 'string',
  decision_makers_known: 'string',
  priority_score: 'number',       // 0-100
  notes_internal: 'string',
  tags: 'array',                  // Array of strings
  created_at: 'string',           // ISO date string
  updated_at: 'string'            // ISO date string
};

var VENUES_REQUIRED_FIELDS = ['id', 'name'];

var VENUES_ENUMS = {
  venue_type: ['concert_hall', 'church', 'festival', 'private', 'other'],
  audience_type: ['classical', 'mixed', 'general', 'other'],
  programming_profile: ['conservative', 'adventurous', 'balanced'],
  relationship_status: ['active', 'past', 'prospect', 'dormant'],
  strategic_value: ['flagship', 'regular', 'occasional', 'target'],
  budget_level: ['high', 'medium', 'low', 'unknown']
};

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

var CALENDAR_SCHEMA = {
  id: 'string',                    // Stable UUID
  title: 'string',
  event_type: 'string',           // concert, recital, teaching, other
  start_date: 'string',           // ISO date string
  end_date: 'string',             // ISO date string
  start_time: 'string',           // HH:MM format
  end_time: 'string',             // HH:MM format
  all_day: 'boolean',
  timezone: 'string',
  venue_id: 'string',             // Reference to Venues entity
  linked_case_id: 'string',       // Reference to Cases entity
  status: 'string',               // tentative, confirmed, cancelled, completed
  expected_income: 'number',
  currency: 'string',             // EUR, USD, GBP, CHF, ARS
  public_visibility: 'boolean',
  program: 'string',
  notes_internal: 'string',
  notes_public: 'string',
  created_at: 'string',           // ISO date string
  updated_at: 'string'            // ISO date string
};

var CALENDAR_REQUIRED_FIELDS = ['id', 'title', 'start_date'];

var CALENDAR_ENUMS = {
  event_type: ['concert', 'recital', 'teaching', 'other'],
  status: ['tentative', 'confirmed', 'cancelled', 'completed'],
  currency: ['EUR', 'USD', 'GBP', 'CHF', 'ARS']
};

// ─────────────────────────────────────────────────────────────────────────────
// INCOME SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

var INCOME_SCHEMA = {
  id: 'string',                    // Stable UUID
  title: 'string',
  income_type: 'string',          // performance_fee, teaching_fee, other
  amount: 'number',
  currency: 'string',             // EUR, USD, GBP, CHF, ARS
  status: 'string',               // expected, invoiced, partial, paid
  gross_or_net: 'string',         // gross, net
  linked_case_id: 'string',       // Reference to Cases entity
  linked_calendar_id: 'string',   // Reference to Calendar entity
  invoice_number: 'string',
  invoice_date: 'string',         // ISO date string
  due_date: 'string',             // ISO date string
  paid_date: 'string',            // ISO date string
  payment_method: 'string',       // bank_transfer, cash, check, other
  travel_reimbursed: 'boolean',
  hotel_covered: 'boolean',
  cash_component: 'number',
  bank_transfer_reference: 'string',
  tax_notes: 'string',
  notes_internal: 'string',
  created_at: 'string',           // ISO date string
  updated_at: 'string'            // ISO date string
};

var INCOME_REQUIRED_FIELDS = ['id', 'title', 'amount', 'currency'];

var INCOME_ENUMS = {
  income_type: ['performance_fee', 'teaching_fee', 'other'],
  status: ['expected', 'invoiced', 'partial', 'paid'],
  currency: ['EUR', 'USD', 'GBP', 'CHF', 'ARS']
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
  window.adminV3Schemas = {
    cases: CASES_SCHEMA,
    contacts: CONTACTS_SCHEMA,
    venues: VENUES_SCHEMA,
    calendar: CALENDAR_SCHEMA,
    income: INCOME_SCHEMA,
    casesRequired: CASES_REQUIRED_FIELDS,
    contactsRequired: CONTACTS_REQUIRED_FIELDS,
    venuesRequired: VENUES_REQUIRED_FIELDS,
    calendarRequired: CALENDAR_REQUIRED_FIELDS,
    incomeRequired: INCOME_REQUIRED_FIELDS,
    casesEnums: CASES_ENUMS,
    contactsEnums: CONTACTS_ENUMS,
    venuesEnums: VENUES_ENUMS,
    calendarEnums: CALENDAR_ENUMS,
    incomeEnums: INCOME_ENUMS
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cases: CASES_SCHEMA,
    contacts: CONTACTS_SCHEMA,
    venues: VENUES_SCHEMA,
    calendar: CALENDAR_SCHEMA,
    income: INCOME_SCHEMA,
    casesRequired: CASES_REQUIRED_FIELDS,
    contactsRequired: CONTACTS_REQUIRED_FIELDS,
    venuesRequired: VENUES_REQUIRED_FIELDS,
    calendarRequired: CALENDAR_REQUIRED_FIELDS,
    incomeRequired: INCOME_REQUIRED_FIELDS,
    casesEnums: CASES_ENUMS,
    contactsEnums: CONTACTS_ENUMS,
    venuesEnums: VENUES_ENUMS,
    calendarEnums: CALENDAR_ENUMS,
    incomeEnums: INCOME_ENUMS
  };
}
