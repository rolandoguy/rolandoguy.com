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
  'title',
  'detail',
  'detail_en',
  'detail_de',
  'detail_es',
  'detail_it',
  'detail_fr',
  'venue',
  'city',
  'venuePhoto',
  'venuePhotoFocus',
  'venueOpacity',
  'extDesc',
  'extDesc_en',
  'extDesc_de',
  'extDesc_es',
  'extDesc_it',
  'extDesc_fr',
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
  'homepage_priority'
];

var PUBLIC_PAST_EVENT_FIELDS = [
  'id',
  'date',
  'time',
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

function sanitizePublicEvent(record) {
  return pickFields(record, PUBLIC_EVENT_FIELDS);
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
