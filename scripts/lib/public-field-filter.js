'use strict';
/**
 * Public Field Filter Module
 *
 * Purpose: Strict whitelist-based filtering to ensure only public-safe fields
 * are included in public JSON payloads. Replaces the insufficient stripAdminNote()
 * approach with explicit field whitelists per data type.
 *
 * Usage:
 *   var filter = require('./lib/public-field-filter');
 *   var publicVideos = videos.map(filter.filterMediaVideo);
 *   var publicEvents = events.map(filter.filterCalendarEvent);
 *
 * Security: This module maintains explicit whitelists of allowed public fields.
 * Any field not in the whitelist is automatically excluded, preventing internal
 * data leakage.
 */

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA FIELDS
// ─────────────────────────────────────────────────────────────────────────────

var PUBLIC_MEDIA_VIDEO_FIELDS = [
  'id',
  'tag',
  'title',
  'sub',
  'composer',
  'repertoireCat',
  'hidden',
  'group',
  'featured',
  'customThumb'
];

var PUBLIC_MEDIA_AUDIO_ITEM_FIELDS = [
  'title',
  'subline',
  'composer',
  'provider',
  'embedUrl',
  'externalUrl',
  'tag',
  'group',
  'repertoireCat',
  'category',
  'type',
  'hidden',
  'featured'
];

var PUBLIC_MEDIA_PHOTO_FIELDS = ['url', 'caption', 'alt', 'photographer', 'orientation', 'focus', 'visible', 'downloadUrl'];

var PUBLIC_MEDIA_CHROME_FIELDS = ['h2', 'sub', 'studioTab', 'stageTab', 'backstageTab', 'backstageEmpty'];

var PUBLIC_MEDIA_CAPTION_FIELDS = ['caption', 'alt', 'photographer'];

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR FIELDS
// ─────────────────────────────────────────────────────────────────────────────

var PUBLIC_CALENDAR_EVENT_FIELDS = [
  'id',
  'day',
  'month',
  'time',
  'startDate',
  'startTime',
  'endDate',
  'endTime',
  'duration',
  'durationMinutes',
  'durationText',
  'publicDuration',
  'programmeDuration',
  'title',
  'detail',
  'detail_en',
  'detail_de',
  'detail_es',
  'detail_it',
  'detail_fr',
  'venue',
  'city',
  'address',
  'address_en',
  'address_de',
  'address_es',
  'address_it',
  'address_fr',
  'mapsUrl',
  'venuePhoto',
  'venuePhotoFocus',
  'venueOpacity',
  'extDesc',
  'ticketStatus',
  'ticketCurrency',
  'ticketPrice',
  'ticketPrice_en',
  'ticketPrice_de',
  'ticketPrice_es',
  'ticketPrice_it',
  'ticketPrice_fr',
  'publicTicketLabel',
  'publicTicketLabel_en',
  'publicTicketLabel_de',
  'publicTicketLabel_es',
  'publicTicketLabel_it',
  'publicTicketLabel_fr',
  'eventLink',
  'eventLinkLabel',
  'flyerImg',
  'moreInfoDisplayMode',
  'moreInfoTemplate',
  'moreInfoTitle',
  'moreInfoSubtitle',
  'moreInfoArtists',
  'moreInfoAddress',
  'moreInfoDescription',
  'moreInfoExtra',
  'moreInfoImage1',
  'moreInfoImage1Focus',
  'moreInfoImage2',
  'moreInfoImage2Focus',
  'moreInfoImage3',
  'moreInfoImage3Focus',
  'moreInfoImage4',
  'moreInfoImage4Focus',
  'moreInfoImage5',
  'moreInfoImage5Focus',
  'modalImg',
  'modalImgHide',
  'private',
  'hidePrivateBadge',
  'hidePrivateDetailLine',
  'privateBadgeText',
  'privateDetailText',
  'status',
  'type',
  'title_en',
  'title_de',
  'title_es',
  'title_it',
  'title_fr',
  'extDesc_en',
  'extDesc_de',
  'extDesc_es',
  'extDesc_it',
  'extDesc_fr',
  'privateBadgeText_en',
  'privateBadgeText_de',
  'privateBadgeText_es',
  'privateBadgeText_it',
  'privateBadgeText_fr',
  'privateDetailText_en',
  'privateDetailText_de',
  'privateDetailText_es',
  'privateDetailText_it',
  'privateDetailText_fr',
  'privatePublicTitleEnabled',
  'privatePublicTitleMode',
  'privatePublicTitle',
  'privatePublicTitle_en',
  'privatePublicTitle_de',
  'privatePublicTitle_es',
  'privatePublicTitle_it',
  'privatePublicTitle_fr',
  'privatePublicVenueEnabled',
  'privatePublicVenueMode',
  'privatePublicVenueLine',
  'privatePublicVenueLine_en',
  'privatePublicVenueLine_de',
  'privatePublicVenueLine_es',
  'privatePublicVenueLine_it',
  'privatePublicVenueLine_fr',
  'privatePublicLocationEnabled',
  'privatePublicLocationMode',
  'privatePublicLocationLine',
  'privatePublicLocationLine_en',
  'privatePublicLocationLine_de',
  'privatePublicLocationLine_es',
  'privatePublicLocationLine_it',
  'privatePublicLocationLine_fr',
  'privatePublicMoreInfo',
  'privatePublicAddressMaps',
  'privatePublicTicket',
  'eventLink_en',
  'eventLinkLabel_en',
  'eventLink_de',
  'eventLinkLabel_de',
  'eventLink_es',
  'eventLinkLabel_es',
  'eventLink_it',
  'eventLinkLabel_it',
  'eventLink_fr',
  'eventLinkLabel_fr',
  'sortDate'
];

var PUBLIC_CALENDAR_CHROME_FIELDS = ['h2', 'intro', 'eventTypes'];

var PUBLIC_CALENDAR_EVENT_TYPE_FIELDS = ['opera', 'concert', 'recital', 'show', 'gala', 'collaboration', 'houseconcert', 'tango', 'other', 'operetta'];

// ─────────────────────────────────────────────────────────────────────────────
// BIOGRAPHY FIELDS
// ─────────────────────────────────────────────────────────────────────────────

var PUBLIC_BIOGRAPHY_FIELDS = ['portraitImage', 'introLine', 'h2', 'paragraphs', 'portraitAlt', 'portraitFit', 'portraitFocus', 'continueSectionTag', 'continueSub', 'ctaRepertoire', 'ctaMedia', 'ctaContact', 'ctaHomeIntro'];

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT FIELDS
// ─────────────────────────────────────────────────────────────────────────────

var PUBLIC_CONTACT_FIELDS = ['title', 'sub', 'email', 'emailBtn', 'webBtn', 'quote', 'contactImageEnabled', 'contactImageUrl', 'contactImageAlt', 'contactImagePlacement', 'contactImageAspect', 'contactImageFit', 'contactImagePosition', 'contactImagePositionManual'];

var PUBLIC_CONTACT_LOCALE_FIELDS = ['title', 'sub', 'emailBtn', 'quote'];

// ─────────────────────────────────────────────────────────────────────────────
// PRESS FIELDS
// ─────────────────────────────────────────────────────────────────────────────

var PUBLIC_PRESS_ITEM_FIELDS = ['source', 'quote', 'visible'];

var PUBLIC_PRESS_META_FIELDS = ['translatedNote', 'showReviewsSection'];

var PUBLIC_PRESS_CHROME_FIELDS = ['reviewsIntro', 'reviewsIntroByLang'];

var PUBLIC_EPK_PHOTO_FIELDS = ['url', 'downloadUrl', 'caption', 'alt', 'photographer', 'orientation', 'visible', 'previewFit', 'previewPosition', 'previewPositionManual', 'previewAspect'];

var PUBLIC_PUBLIC_PDF_FIELDS = ['url', 'data'];

// ─────────────────────────────────────────────────────────────────────────────
// REPERTOIRE FIELDS
// ─────────────────────────────────────────────────────────────────────────────

var PUBLIC_REPERTOIRE_CARD_FIELDS = ['role', 'opera', 'composer', 'work', 'status', 'cat', 'category'];

var PUBLIC_REPERTOIRE_CHROME_FIELDS = ['h2', 'intro', 'repertoireImageEnabled', 'repertoireImageUrl', 'repertoireImageAlt', 'repertoireImagePlacement', 'repertoireImageAspect', 'repertoireImageFit', 'repertoireImagePosition', 'repertoireImagePositionManual'];

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMS FIELDS
// ─────────────────────────────────────────────────────────────────────────────

var PUBLIC_PROGRAMS_ITEM_FIELDS = ['id', 'order', 'published', 'title', 'description', 'formations', 'duration', 'idealFor', 'imageUrl', 'imageAlt', 'imageFit', 'imagePosition', 'imagePositionManual'];

var PUBLIC_PROGRAMS_CHROME_FIELDS = ['title', 'subtitle', 'profileBridge', 'intro', 'closingNote', 'linkLabel'];

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL FIELD BLACKLIST (catch-all for any missed fields)
// ─────────────────────────────────────────────────────────────────────────────

var INTERNAL_FIELD_BLACKLIST = [
  'adminNote',
  'internalNotes',
  'editorialNotes',
  'negotiation_note',
  'nextFollowUpDate',
  'contactEmail',
  'contactPhone',
  'contactPhoneOverride',
  'fee_estimate',
  'revenue',
  'cachet',
  'followup_required',
  'contact_internal',
  'negotiation_status',
  'promoter_contact',
  'preset',
  'eventType',
  'durationMin',
  'formation',
  'rehearsalCount',
  'rehearsalFeePerArtist',
  'leadArtistFee',
  'collaboratorFee',
  'pianistFee',
  'travelCost',
  'hotelCost',
  'localTransportCost',
  'adminBuffer',
  'artistFeeMultiplier',
  'includesPianist',
  'numberOfArtists',
  'negotiationNotes',
  'venueType',
  'notes',
  'fitTags',
  'plannedRepertoire',
  'messageSent',
  'cacheProposed',
  'cacheNegotiated',
  'statusInternal',
  'publication_contact',
  'contact_override',
  'homepage_priority', // Only if used for internal ranking; can be public if needed for homepage highlights
  // Revenue and payment fields (internal financial data from rg_perfs)
  'revenueAmount',
  'revenueCurrency',
  'revenueStatus',
  'revenueNotes',
  'paymentStatus',
  'paymentModel',
  'actualReceivedAmount',
  'actualReceivedCurrency'
];

// ─────────────────────────────────────────────────────────────────────────────
// FILTER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generic whitelist filter - copies only fields present in whitelist
 */
function filterByWhitelist(obj, whitelist) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  var out = {};
  for (var i = 0; i < whitelist.length; i++) {
    var key = whitelist[i];
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      out[key] = obj[key];
    }
  }
  return out;
}

/**
 * Blacklist filter - removes any fields present in blacklist
 */
function filterByBlacklist(obj, blacklist) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  var out = {};
  for (var k in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
    if (blacklist.indexOf(k) >= 0) continue;
    out[k] = obj[k];
  }
  return out;
}

/**
 * Combined filter: whitelist first, then blacklist as safety catch
 */
function filterCombined(obj, whitelist) {
  var whitelisted = filterByWhitelist(obj, whitelist);
  var safe = filterByBlacklist(whitelisted, INTERNAL_FIELD_BLACKLIST);
  return safe;
}

function truthyFlag(value) {
  var s = String(value == null ? '' : value).trim().toLowerCase();
  return value === true || s === 'true' || s === '1' || s === 'yes' || s === 'on';
}

function isPrivateCalendarEvent(event) {
  if (!event || typeof event !== 'object' || Array.isArray(event)) return false;
  return Object.prototype.hasOwnProperty.call(event, 'private') && truthyFlag(event.private);
}

function privateEventAllows(event, key) {
  if (!isPrivateCalendarEvent(event)) return true;
  if (key === 'title') return truthyFlag(event.privatePublicTitleEnabled) && String(event.privatePublicTitleMode || '').trim().toLowerCase() === 'real';
  if (key === 'venue') return truthyFlag(event.privatePublicVenueEnabled) && String(event.privatePublicVenueMode || '').trim().toLowerCase() === 'real';
  if (key === 'address' || key === 'mapsUrl') return truthyFlag(event.privatePublicAddressMaps);
  if (key === 'ticket') return truthyFlag(event.privatePublicTicket);
  return false;
}

function removeFields(obj, fields) {
  fields.forEach(function (field) {
    if (Object.prototype.hasOwnProperty.call(obj, field)) delete obj[field];
  });
}

function stripPrivateCalendarInternals(safe, source) {
  if (!isPrivateCalendarEvent(source)) return safe;
  if (!privateEventAllows(source, 'title')) removeFields(safe, ['title', 'title_en', 'title_de', 'title_es', 'title_it', 'title_fr']);
  if (!privateEventAllows(source, 'venue')) removeFields(safe, ['venue']);
  if (!privateEventAllows(source, 'address')) removeFields(safe, ['address', 'address_en', 'address_de', 'address_es', 'address_it', 'address_fr', 'mapsUrl', 'moreInfoAddress']);
  removeFields(safe, [
    'detail', 'detail_en', 'detail_de', 'detail_es', 'detail_it', 'detail_fr',
    'extDesc', 'extDesc_en', 'extDesc_de', 'extDesc_es', 'extDesc_it', 'extDesc_fr',
    'moreInfoTitle', 'moreInfoSubtitle', 'moreInfoArtists', 'moreInfoDescription', 'moreInfoExtra',
    'moreInfoImage1', 'moreInfoImage1Focus', 'moreInfoImage2', 'moreInfoImage2Focus', 'moreInfoImage3', 'moreInfoImage3Focus',
    'moreInfoImage4', 'moreInfoImage4Focus', 'moreInfoImage5', 'moreInfoImage5Focus',
    'venuePhoto', 'venuePhotoFocus', 'venueOpacity', 'modalImg', 'flyerImg'
  ]);
  if (!privateEventAllows(source, 'ticket')) {
    removeFields(safe, [
      'ticketStatus', 'ticketCurrency', 'ticketPrice', 'ticketPrice_en', 'ticketPrice_de', 'ticketPrice_es', 'ticketPrice_it', 'ticketPrice_fr',
      'publicTicketLabel', 'publicTicketLabel_en', 'publicTicketLabel_de', 'publicTicketLabel_es', 'publicTicketLabel_it', 'publicTicketLabel_fr',
      'eventLink', 'eventLinkLabel', 'eventLink_en', 'eventLinkLabel_en', 'eventLink_de', 'eventLinkLabel_de', 'eventLink_es', 'eventLinkLabel_es',
      'eventLink_it', 'eventLinkLabel_it', 'eventLink_fr', 'eventLinkLabel_fr'
    ]);
  }
  return safe;
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA FILTERS
// ─────────────────────────────────────────────────────────────────────────────

function filterMediaVideo(video) {
  return filterByWhitelist(video, PUBLIC_MEDIA_VIDEO_FIELDS);
}

function filterMediaAudioItem(audioItem) {
  return filterByWhitelist(audioItem, PUBLIC_MEDIA_AUDIO_ITEM_FIELDS);
}

function filterMediaPhoto(photo) {
  if (typeof photo === 'string') return photo;
  return filterCombined(photo, PUBLIC_MEDIA_PHOTO_FIELDS);
}

function filterMediaChrome(chrome) {
  return filterByWhitelist(chrome, PUBLIC_MEDIA_CHROME_FIELDS);
}

function filterMediaCaption(caption) {
  return filterCombined(caption, PUBLIC_MEDIA_CAPTION_FIELDS);
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR FILTERS
// ─────────────────────────────────────────────────────────────────────────────

function filterCalendarEvent(event) {
  return stripPrivateCalendarInternals(filterCombined(event, PUBLIC_CALENDAR_EVENT_FIELDS), event);
}

function filterCalendarChrome(chrome) {
  return filterByWhitelist(chrome, PUBLIC_CALENDAR_CHROME_FIELDS);
}

function filterCalendarEventTypes(eventTypes) {
  return filterByWhitelist(eventTypes, PUBLIC_CALENDAR_EVENT_TYPE_FIELDS);
}

// ─────────────────────────────────────────────────────────────────────────────
// BIOGRAPHY FILTERS
// ─────────────────────────────────────────────────────────────────────────────

function filterBiography(bio) {
  return filterCombined(bio, PUBLIC_BIOGRAPHY_FIELDS);
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT FILTERS
// ─────────────────────────────────────────────────────────────────────────────

function filterContact(contact) {
  return filterCombined(contact, PUBLIC_CONTACT_FIELDS);
}

function filterContactLocale(locale) {
  return filterCombined(locale, PUBLIC_CONTACT_LOCALE_FIELDS);
}

// ─────────────────────────────────────────────────────────────────────────────
// PRESS FILTERS
// ─────────────────────────────────────────────────────────────────────────────

function filterPressItem(item) {
  return filterCombined(item, PUBLIC_PRESS_ITEM_FIELDS);
}

function filterPressMeta(meta) {
  return filterCombined(meta, PUBLIC_PRESS_META_FIELDS);
}

function filterPressChrome(chrome) {
  return filterByWhitelist(chrome, PUBLIC_PRESS_CHROME_FIELDS);
}

function filterEpkPhoto(photo) {
  if (typeof photo === 'string') return photo;
  return filterCombined(photo, PUBLIC_EPK_PHOTO_FIELDS);
}

function filterPublicPdf(pdf) {
  return filterCombined(pdf, PUBLIC_PUBLIC_PDF_FIELDS);
}

// ─────────────────────────────────────────────────────────────────────────────
// REPERTOIRE FILTERS
// ─────────────────────────────────────────────────────────────────────────────

function filterRepertoireCard(card) {
  return filterCombined(card, PUBLIC_REPERTOIRE_CARD_FIELDS);
}

function filterRepertoireChrome(chrome) {
  return filterByWhitelist(chrome, PUBLIC_REPERTOIRE_CHROME_FIELDS);
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMS FILTERS
// ─────────────────────────────────────────────────────────────────────────────

function filterProgramsItem(item) {
  return filterCombined(item, PUBLIC_PROGRAMS_ITEM_FIELDS);
}

function filterProgramsChrome(chrome) {
  return filterByWhitelist(chrome, PUBLIC_PROGRAMS_CHROME_FIELDS);
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if an object contains any internal fields
 * Returns array of internal field names found, or empty array if clean
 */
function detectInternalFields(obj, path) {
  path = path || 'root';
  var found = [];
  if (!obj || typeof obj !== 'object') return found;
  
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (INTERNAL_FIELD_BLACKLIST.indexOf(key) >= 0) {
      found.push(path + '.' + key);
    }
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      var nested = detectInternalFields(obj[key], path + '.' + key);
      found = found.concat(nested);
    }
  }
  return found;
}

/**
 * Validate an entire payload for internal field leakage
 * Throws error if internal fields detected
 */
function validatePublicPayload(payload, payloadName) {
  payloadName = payloadName || 'payload';
  var violations = detectInternalFields(payload);
  if (violations.length > 0) {
    throw new Error(
      'Security validation failed for ' +
        payloadName +
        ': internal fields detected: ' +
        violations.join(', ')
    );
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // Whitelist constants (for reference/testing)
  PUBLIC_MEDIA_VIDEO_FIELDS: PUBLIC_MEDIA_VIDEO_FIELDS,
  PUBLIC_MEDIA_AUDIO_ITEM_FIELDS: PUBLIC_MEDIA_AUDIO_ITEM_FIELDS,
  PUBLIC_MEDIA_PHOTO_FIELDS: PUBLIC_MEDIA_PHOTO_FIELDS,
  PUBLIC_CALENDAR_EVENT_FIELDS: PUBLIC_CALENDAR_EVENT_FIELDS,
  PUBLIC_BIOGRAPHY_FIELDS: PUBLIC_BIOGRAPHY_FIELDS,
  PUBLIC_CONTACT_FIELDS: PUBLIC_CONTACT_FIELDS,
  PUBLIC_PRESS_ITEM_FIELDS: PUBLIC_PRESS_ITEM_FIELDS,
  PUBLIC_REPERTOIRE_CARD_FIELDS: PUBLIC_REPERTOIRE_CARD_FIELDS,
  PUBLIC_PROGRAMS_ITEM_FIELDS: PUBLIC_PROGRAMS_ITEM_FIELDS,
  INTERNAL_FIELD_BLACKLIST: INTERNAL_FIELD_BLACKLIST,
  
  // Filter functions
  filterMediaVideo: filterMediaVideo,
  filterMediaAudioItem: filterMediaAudioItem,
  filterMediaPhoto: filterMediaPhoto,
  filterMediaChrome: filterMediaChrome,
  filterMediaCaption: filterMediaCaption,
  filterCalendarEvent: filterCalendarEvent,
  filterCalendarChrome: filterCalendarChrome,
  filterCalendarEventTypes: filterCalendarEventTypes,
  filterBiography: filterBiography,
  filterContact: filterContact,
  filterContactLocale: filterContactLocale,
  filterPressItem: filterPressItem,
  filterPressMeta: filterPressMeta,
  filterPressChrome: filterPressChrome,
  filterEpkPhoto: filterEpkPhoto,
  filterPublicPdf: filterPublicPdf,
  filterRepertoireCard: filterRepertoireCard,
  filterRepertoireChrome: filterRepertoireChrome,
  filterProgramsItem: filterProgramsItem,
  filterProgramsChrome: filterProgramsChrome,
  
  // Validation functions
  detectInternalFields: detectInternalFields,
  validatePublicPayload: validatePublicPayload
};
