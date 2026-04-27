'use strict';

/**
 * Public-safe vs internal event schema definitions.
 *
 * Public pages must only consume the public schema defined here.
 * Admin/internal tools may use the broader internal schema, but every transition
 * from internal -> public must go through the sanitizer functions in this file.
 */

var PUBLIC_EVENT_FIELDS = [
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
  'extDesc_en',
  'extDesc_de',
  'extDesc_es',
  'extDesc_it',
  'extDesc_fr',
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
  'modalEnabled',
  'modalImg',
  'modalImgHide',
  'private',
  'hidePrivateBadge',
  'hidePrivateDetailLine',
  'privateBadgeText',
  'privateDetailText',
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
  'status',
  'type',
  'title_en',
  'title_de',
  'title_es',
  'title_it',
  'title_fr',
  'sortDate',
  'featured',
  'featured_visual',
  'featured_layout',
  'featured_contexts',
  'homepage_priority'
];

var PUBLIC_PAST_EVENT_FIELDS = [
  'id',
  'date',
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
  'place',
  'city',
  'address',
  'description',
  'linkText',
  'link',
  'image',
  'status',
  'private'
];

var PUBLIC_CALENDAR_CHROME_FIELDS = ['h2', 'intro', 'eventTypes', 'monthNames'];

/**
 * Exact internal/admin event schema for legacy/admin event records.
 * This reflects the mixed admin-era record shape that must never be sent
 * directly to public pages.
 */
var INTERNAL_EVENT_FIELDS = [
  'id',
  'day',
  'month',
  'time',
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
  'venueBrightness',
  'venueContrast',
  'venueOpacity',
  'extDesc',
  'extDesc_en',
  'extDesc_de',
  'extDesc_es',
  'extDesc_it',
  'extDesc_fr',
  'ticketStatus',
  'ticketCurrency',
  'ticketPrice',
  'eventLink',
  'eventLinkLabel',
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
  'moreInfoLabel',
  'modalEnabled',
  'modalImg',
  'modalImgHide',
  'private',
  'hidePrivateBadge',
  'hidePrivateDetailLine',
  'privateBadgeText',
  'privateDetailText',
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
  'status',
  'type',
  'title_en',
  'title_de',
  'title_es',
  'title_it',
  'title_fr',
  'sortDate',
  'featured',
  'featured_visual',
  'featured_layout',
  'featured_contexts',
  'homepage_priority',
  'editorialStatus',
  'revenueAmount',
  'revenueCurrency',
  'revenueStatus',
  'revenueNotes',
  'paymentStatus',
  'paymentModel',
  'actualReceivedAmount',
  'actualReceivedCurrency'
];

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function pickFields(src, fields) {
  var out = {};
  if (!src || typeof src !== 'object' || Array.isArray(src)) return out;
  fields.forEach(function (field) {
    if (Object.prototype.hasOwnProperty.call(src, field) && src[field] !== undefined) {
      out[field] = src[field];
    }
  });
  return out;
}

function firstNonEmptyField(src, fields) {
  if (!src || typeof src !== 'object' || Array.isArray(src)) return '';
  for (var i = 0; i < fields.length; i++) {
    var key = fields[i];
    if (Object.prototype.hasOwnProperty.call(src, key) && src[key] != null && String(src[key]).trim() !== '') {
      return src[key];
    }
  }
  return '';
}

function truthyFlag(value) {
  var s = String(value == null ? '' : value).trim().toLowerCase();
  return value === true || s === 'true' || s === '1' || s === 'yes' || s === 'on';
}

function isPrivatePublicEvent(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return false;
  return Object.prototype.hasOwnProperty.call(record, 'private') && truthyFlag(record.private);
}

function privatePublicAllowed(record, key) {
  if (!isPrivatePublicEvent(record)) return true;
  if (key === 'title') return truthyFlag(record.privatePublicTitleEnabled) && String(record.privatePublicTitleMode || '').trim().toLowerCase() === 'real';
  if (key === 'venue') return truthyFlag(record.privatePublicVenueEnabled) && String(record.privatePublicVenueMode || '').trim().toLowerCase() === 'real';
  if (key === 'address' || key === 'mapsUrl') return truthyFlag(record.privatePublicAddressMaps);
  if (key === 'ticket') return truthyFlag(record.privatePublicTicket);
  return false;
}

function deletePublicFields(record, fields) {
  fields.forEach(function (field) {
    if (Object.prototype.hasOwnProperty.call(record, field)) delete record[field];
  });
}

function stripPrivateEventInternals(safe, source) {
  if (!isPrivatePublicEvent(source)) return safe;
  if (!privatePublicAllowed(source, 'title')) {
    deletePublicFields(safe, ['title', 'title_en', 'title_de', 'title_es', 'title_it', 'title_fr']);
  }
  if (!privatePublicAllowed(source, 'venue')) deletePublicFields(safe, ['venue']);
  if (!privatePublicAllowed(source, 'address')) {
    deletePublicFields(safe, ['address', 'address_en', 'address_de', 'address_es', 'address_it', 'address_fr', 'mapsUrl', 'moreInfoAddress']);
  }
  deletePublicFields(safe, [
    'detail', 'detail_en', 'detail_de', 'detail_es', 'detail_it', 'detail_fr',
    'extDesc', 'extDesc_en', 'extDesc_de', 'extDesc_es', 'extDesc_it', 'extDesc_fr',
    'moreInfoTitle', 'moreInfoSubtitle', 'moreInfoArtists', 'moreInfoDescription', 'moreInfoExtra',
    'moreInfoImage1', 'moreInfoImage1Focus', 'moreInfoImage2', 'moreInfoImage2Focus', 'moreInfoImage3', 'moreInfoImage3Focus',
    'moreInfoImage4', 'moreInfoImage4Focus', 'moreInfoImage5', 'moreInfoImage5Focus',
    'venuePhoto', 'venuePhotoFocus', 'venueOpacity', 'modalImg', 'flyerImg'
  ]);
  if (!privatePublicAllowed(source, 'ticket')) {
    deletePublicFields(safe, [
      'ticketStatus', 'ticketCurrency', 'ticketPrice', 'ticketPrice_en', 'ticketPrice_de', 'ticketPrice_es', 'ticketPrice_it', 'ticketPrice_fr',
      'publicTicketLabel', 'publicTicketLabel_en', 'publicTicketLabel_de', 'publicTicketLabel_es', 'publicTicketLabel_it', 'publicTicketLabel_fr',
      'eventLink', 'eventLinkLabel', 'eventLink_en', 'eventLinkLabel_en', 'eventLink_de', 'eventLinkLabel_de', 'eventLink_es', 'eventLinkLabel_es',
      'eventLink_it', 'eventLinkLabel_it', 'eventLink_fr', 'eventLinkLabel_fr'
    ]);
  }
  return safe;
}

function sanitizePublicEvent(record) {
  var safe = pickFields(record, PUBLIC_EVENT_FIELDS);
  if (safe.ticketPrice == null || String(safe.ticketPrice).trim() === '') {
    safe.ticketPrice = firstNonEmptyField(record, ['priceInfo', 'modalPrice', 'modalTicketPrice', 'price', 'ticketInfo']);
  }
  if (safe.ticketCurrency == null || String(safe.ticketCurrency).trim() === '') {
    safe.ticketCurrency = firstNonEmptyField(record, ['priceCurrency', 'currency']) || 'EUR';
  }
  if (safe.address == null || String(safe.address).trim() === '') {
    safe.address = firstNonEmptyField(record, ['venueAddress', 'modalAddress', 'streetAddress']);
  }
  if (safe.mapsUrl == null || String(safe.mapsUrl).trim() === '') {
    safe.mapsUrl = firstNonEmptyField(record, ['mapUrl', 'mapsLink', 'modalMapsLink', 'locationUrl', 'directionsUrl']);
  }
  if (safe.extDesc == null || String(safe.extDesc).trim() === '') {
    safe.extDesc = firstNonEmptyField(record, ['modalText', 'description', 'longDescription', 'modalLongDesc', 'moreInfoDescription', 'moreInfoExtra']);
  }
  ['en', 'de', 'es', 'it', 'fr'].forEach(function (lang) {
    var priceKey = 'ticketPrice_' + lang;
    if (safe[priceKey] == null || String(safe[priceKey]).trim() === '') {
      safe[priceKey] = firstNonEmptyField(record, [
        'priceInfo_' + lang,
        'modalPrice_' + lang,
        'modalTicketPrice_' + lang,
        'price_' + lang,
        'ticketInfo_' + lang
      ]);
    }
    var labelKey = 'publicTicketLabel_' + lang;
    if (safe[labelKey] == null || String(safe[labelKey]).trim() === '') {
      safe[labelKey] = firstNonEmptyField(record, [
        'publicTicketLabel_' + lang,
        'ticketLabel_' + lang,
        'priceLabel_' + lang
      ]);
    }
    var key = 'extDesc_' + lang;
    if (safe[key] != null && String(safe[key]).trim() !== '') return;
    safe[key] = firstNonEmptyField(record, [
      'modalText_' + lang,
      'description_' + lang,
      'longDescription_' + lang,
      'modalLongDesc_' + lang,
      'moreInfoDescription_' + lang,
      'moreInfoExtra_' + lang
    ]);
  });
  return stripPrivateEventInternals(safe, record);
}

function sanitizePublicPastEvent(record) {
  return pickFields(record, PUBLIC_PAST_EVENT_FIELDS);
}

function sanitizePublicCalendarChrome(record) {
  var safe = pickFields(record, PUBLIC_CALENDAR_CHROME_FIELDS);
  if (safe.eventTypes && typeof safe.eventTypes === 'object' && !Array.isArray(safe.eventTypes)) {
    safe.eventTypes = clone(safe.eventTypes);
  }
  if (safe.monthNames && typeof safe.monthNames === 'object' && !Array.isArray(safe.monthNames)) {
    safe.monthNames = clone(safe.monthNames);
  }
  return safe;
}

module.exports = {
  PUBLIC_EVENT_FIELDS: PUBLIC_EVENT_FIELDS,
  PUBLIC_PAST_EVENT_FIELDS: PUBLIC_PAST_EVENT_FIELDS,
  PUBLIC_CALENDAR_CHROME_FIELDS: PUBLIC_CALENDAR_CHROME_FIELDS,
  INTERNAL_EVENT_FIELDS: INTERNAL_EVENT_FIELDS,
  sanitizePublicEvent: sanitizePublicEvent,
  sanitizePublicPastEvent: sanitizePublicPastEvent,
  sanitizePublicCalendarChrome: sanitizePublicCalendarChrome
};
