/**
 * Single source of truth for brand + business settings.
 * Change the agency name, contact details and pricing here —
 * the frontend reads this via GET /api/config.
 */
module.exports = {
  brand: {
    name: 'Konolhi Web Solutions',
    tagline: 'We build websites that bring customers, and simple dashboards that help you manage them.',
    location: 'Malé, Hulhumalé, Maldives'
  },
  contact: {
    phone: '+960 998-7899',
    whatsappNumber: '9609987899',        // digits only, no +, used for wa.me links
    whatsappDisplay: '+960 998-7899',
    email: 'hello@konolhi.com',
    hours: 'Sat-Thu, 9:00-18:00 (MVT)',
    address: {
      line1: 'H. Miraaz, Ground Floor',
      line2: 'Burevi Magu, 20008',
      city: "K. Malé City",
      country: 'Maldives'
    }
  },
  packages: [
    { id: 'starter', name: 'Starter Website', priceFrom: 37250 },
    { id: 'growth', name: 'Growth Website', priceFrom: 74750 },
    { id: 'premium', name: 'Premium Business System', priceFrom: 162250 }
  ],
  currency: 'MVR'
};
