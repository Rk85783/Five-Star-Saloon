import assert from 'node:assert/strict';
import process from 'node:process';
import test from 'node:test';
import { shopConfig } from './shopConfig.js';
import {
  buildWhatsAppMessage,
  createWhatsAppBookingUrl,
  isValidWhatsAppNumber,
  normalizeWhatsAppNumber,
  prepareWhatsAppBooking,
  validateBookingRequest,
} from './booking.js';

const services = [
  { id: 'cut', name: 'Classic haircut' },
  { id: 'beard', name: 'Beard shape & trim' },
];

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const validRequest = {
  name: 'Asha Rao',
  serviceId: 'cut',
  preferredDate: formatLocalDate(tomorrow),
  preferredTime: '16:30',
  message: '',
};

test('booking validation requires a name, known service, date and time', () => {
  assert.deepEqual(validateBookingRequest(validRequest, services), {});
  assert.deepEqual(validateBookingRequest({ ...validRequest, name: '   ', serviceId: 'unknown', preferredDate: '', preferredTime: '' }, services), {
    name: 'Enter your name.',
    serviceId: 'Choose a service.',
    preferredDate: 'Choose a preferred date.',
    preferredTime: 'Choose a preferred time.',
  });
});

test('booking validation rejects past dates and invalid times', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  assert.deepEqual(validateBookingRequest({ ...validRequest, preferredDate: formatLocalDate(yesterday), preferredTime: '25:70' }, services), {
    preferredDate: 'Choose a valid date that is not in the past.',
    preferredTime: 'Choose a valid preferred time.',
  });
});

test('booking validation uses the local calendar date and rejects impossible dates', () => {
  const previousTimeZone = process.env.TZ;
  process.env.TZ = 'Pacific/Kiritimati';
  try {
    const localToday = formatLocalDate(new Date());
    assert.deepEqual(validateBookingRequest({ ...validRequest, preferredDate: localToday }, services), {});
    assert.deepEqual(validateBookingRequest({ ...validRequest, preferredDate: '2026-02-31' }, services), {
      preferredDate: 'Choose a valid date that is not in the past.',
    });
  } finally {
    if (previousTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimeZone;
  }
});

test('WhatsApp number normalization accepts an international number and rejects missing or malformed values', () => {
  assert.equal(normalizeWhatsAppNumber('+91 98765-43210'), '919876543210');
  assert.equal(isValidWhatsAppNumber('+91 98765-43210'), true);
  assert.equal(isValidWhatsAppNumber('919876543210'), true);
  assert.equal(isValidWhatsAppNumber('9876543210'), false);
  assert.equal(isValidWhatsAppNumber('+1 98765-43210'), false);
  assert.equal(isValidWhatsAppNumber(''), false);
  assert.equal(isValidWhatsAppNumber('123'), false);
});

test('booking stays disabled until the shop WhatsApp number is configured', () => {
  assert.equal(shopConfig.whatsappNumber, '');
  assert.equal(isValidWhatsAppNumber(shopConfig.whatsappNumber), false);
  assert.equal(shopConfig.address, '');
  assert.deepEqual(shopConfig.openingHours, []);
});

test('message includes only supplied booking details and the manual confirmation notice', () => {
  const message = buildWhatsAppMessage('Five Star Saloon', {
    ...validRequest,
    name: '  Asha & Rao  ',
    message: 'Please call / text: 9&',
  }, services);

  assert.match(message, /Name: Asha & Rao/);
  assert.match(message, /Service: Classic haircut/);
  assert.match(message, /Message: Please call \/ text: 9&/);
  assert.match(message, /not a confirmed appointment/);
});

test('Click-to-Chat URL encodes all booking text and stays disabled without a valid number', () => {
  const message = buildWhatsAppMessage('Five Star Saloon', {
    ...validRequest,
    message: 'Call / text & confirm',
  }, services);
  const url = createWhatsAppBookingUrl('+91 98765-43210', message);

  assert.equal(new URL(url).hostname, 'wa.me');
  assert.equal(new URL(url).pathname, '/919876543210');
  assert.equal(new URL(url).searchParams.get('text'), message);
  assert.ok(url.includes(encodeURIComponent('Call / text & confirm')));
  assert.equal(createWhatsAppBookingUrl('', message), null);
});

test('Click-to-Chat encoding preserves spaces, ampersands, plus signs, punctuation and Unicode', () => {
  const message = buildWhatsAppMessage('Five Star Saloon', {
    ...validRequest,
    name: 'आरव + Anu',
    message: 'Call + text, & confirm! (कृपया) — ठीक है?',
  }, services);
  const url = createWhatsAppBookingUrl('+91 (98765) 43210', message);

  assert.equal(new URL(url).pathname, '/919876543210');
  assert.equal(new URL(url).searchParams.get('text'), message);
  assert.ok(url.includes('%2B'));
  assert.ok(url.includes('%26'));
  assert.ok(url.includes('%3F'));
  assert.ok(url.includes('%E0%A4'));
});

test('invalid or incomplete booking requests cannot produce a WhatsApp submission URL', () => {
  const invalid = prepareWhatsAppBooking('+91 98765-43210', 'Five Star Saloon', {
    ...validRequest,
    name: '',
    serviceId: '',
    preferredDate: '',
    preferredTime: '',
  }, services);
  const missingNumber = prepareWhatsAppBooking('', 'Five Star Saloon', validRequest, services);

  assert.equal(invalid.url, null);
  assert.deepEqual(Object.keys(invalid.errors).sort(), ['name', 'preferredDate', 'preferredTime', 'serviceId']);
  assert.equal(missingNumber.url, null);
  assert.deepEqual(missingNumber.errors, {});
});

test('message generation rejects service ids outside the shop configuration', () => {
  assert.throws(() => buildWhatsAppMessage('Five Star Saloon', { ...validRequest, serviceId: 'unknown' }, services), /valid service/);
});
