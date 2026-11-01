export const normalizeWhatsAppNumber = (number = '') => String(number).replace(/\D/g, '');

export const isValidWhatsAppNumber = (number = '') => {
  const digits = normalizeWhatsAppNumber(number);
  // The shop is in India: WhatsApp Click-to-Chat needs country code 91 plus the 10-digit number.
  return /^91[1-9]\d{9}$/.test(digits);
};

export function validateBookingRequest(values, services) {
  const errors = {};

  if (!values.name?.trim()) errors.name = 'Enter your name.';
  if (!services.some(({ id }) => id === values.serviceId)) errors.serviceId = 'Choose a service.';
  if (!values.preferredDate) errors.preferredDate = 'Choose a preferred date.';
  else {
    const selectedDate = new Date(`${values.preferredDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedLocalDate = Number.isNaN(selectedDate.getTime()) ? '' : [
      selectedDate.getFullYear(),
      String(selectedDate.getMonth() + 1).padStart(2, '0'),
      String(selectedDate.getDate()).padStart(2, '0'),
    ].join('-');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.preferredDate) || selectedLocalDate !== values.preferredDate || selectedDate.getTime() < today.getTime()) {
      errors.preferredDate = 'Choose a valid date that is not in the past.';
    }
  }
  if (!values.preferredTime) errors.preferredTime = 'Choose a preferred time.';
  else if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(values.preferredTime)) errors.preferredTime = 'Choose a valid preferred time.';

  return errors;
}

export function buildWhatsAppMessage(shopName, values, services) {
  const service = services.find(({ id }) => id === values.serviceId);
  if (!service) throw new Error('Select a valid service before creating a booking request.');

  const lines = [
    `Hello ${shopName}, I would like to request an appointment.`,
    '',
    `Name: ${values.name.trim()}`,
    `Service: ${service.name}`,
    `Preferred date: ${values.preferredDate}`,
    `Preferred time: ${values.preferredTime}`,
  ];

  if (values.message?.trim()) lines.push(`Message: ${values.message.trim()}`);
  lines.push('', 'Please confirm availability. I understand this request is not a confirmed appointment.');
  return lines.join('\n');
}

export function createWhatsAppBookingUrl(number, message) {
  if (!isValidWhatsAppNumber(number)) return null;
  return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;
}

export function prepareWhatsAppBooking(number, shopName, values, services) {
  const errors = validateBookingRequest(values, services);
  if (!isValidWhatsAppNumber(number) || Object.keys(errors).length > 0) return { errors, url: null };

  const message = buildWhatsAppMessage(shopName, values, services);
  return { errors, url: createWhatsAppBookingUrl(number, message) };
}
