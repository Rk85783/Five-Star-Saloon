// Static configuration is the initial source of truth; no API is required to render the site.
export const shopConfig = {
  name: '5 Star The Family Saloon',
  shortName: 'Five Star',
  currency: 'INR',
  whatsappNumber: '918770332791',
  address: 'Mevati Mohalla, Sagar Taal Road, Sagartal Chowk, Gwalior, Madhya Pradesh 474008',
  directionsUrl: 'https://www.google.com/maps/search/?api=1&query=5+Star+The+Family+Saloon%2C+Mevati+Mohalla%2C+Sagar+Taal+Road%2C+Sagartal+Chowk%2C+Gwalior+474008',
  openingHours: [
    { day: 'Monday', hours: '8:00 am – 9:00 pm' },
    { day: 'Tuesday', hours: '8:00 am – 9:00 pm' },
    { day: 'Wednesday', hours: '8:00 am – 9:00 pm' },
    { day: 'Thursday', hours: '8:00 am – 9:00 pm' },
    { day: 'Friday', hours: '8:00 am – 9:00 pm' },
    { day: 'Saturday', hours: '8:00 am – 9:00 pm' },
    { day: 'Sunday', hours: '8:00 am – 9:00 pm' },
  ],
  // Indicative sample menu only; confirm every item and price with the shop before launch.
  services: [
    { id: 'classic-cut', name: 'Classic haircut', description: 'A clean, considered cut, finished to suit your style.', price: 299 },
    { id: 'beard-shape', name: 'Beard shape & trim', description: 'A tidy shape and a sharper outline.', price: 199 },
    { id: 'cut-and-beard', name: 'Cut & beard', description: 'A complete refresh from top to neckline.', price: 449 },
    { id: 'head-massage', name: 'Head massage', description: 'A moment to slow down and reset.', price: 249 },
  ],
};
