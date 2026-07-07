const express = require('express');
const config = require('../../config/site.config');
const enquiryController = require('../controllers/enquiry.controller');
const reviewController = require('../controllers/review.controller');
const blogController = require('../controllers/blog.controller');
const rateLimiter = require('../middleware/rateLimiter');
const { validate, patterns } = require('../middleware/validate');

const router = express.Router();
const formLimiter = rateLimiter({ windowMs: 60_000, max: 5 });

// Simple bearer-token guard for admin reads (set ADMIN_TOKEN in env).
function adminOnly(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  next();
}

router.get('/config', (req, res) => res.json({ ok: true, ...config }));
router.get('/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

const enquirySchema = {
  businessName: { required: true, label: 'Business name', maxLength: 120 },
  contactPerson: { required: true, label: 'Contact person', maxLength: 120 },
  whatsapp: { required: true, label: 'WhatsApp number', pattern: patterns.phone, message: 'Enter a valid WhatsApp number, e.g. +960 998-7899.' },
  email: { required: true, label: 'Email', pattern: patterns.email, message: 'Enter a valid email address.' },
  industry: { required: true, label: 'Industry', maxLength: 80 },
  websiteStatus: { required: true, label: 'Existing website status', maxLength: 80 },
  services: { required: true, label: 'Required services', isArray: true },
  budget: { required: false, label: 'Estimated budget', maxLength: 80 },
  timeline: { required: false, label: 'Preferred timeline', maxLength: 80 },
  message: { required: false, label: 'Message', maxLength: 2000 }
};

const reviewSchema = {
  businessName: { required: true, label: 'Business name', maxLength: 120 },
  contactPerson: { required: true, label: 'Contact person', maxLength: 120 },
  whatsapp: { required: true, label: 'WhatsApp number', pattern: patterns.phone, message: 'Enter a valid WhatsApp number, e.g. +960 998-7899.' },
  email: { required: false, label: 'Email', pattern: patterns.email, message: 'Enter a valid email address.' },
  websiteUrl: { required: false, label: 'Website or Instagram link', maxLength: 300 },
  industry: { required: false, label: 'Industry', maxLength: 80 },
  goal: { required: false, label: 'Main goal', maxLength: 500 }
};

router.post('/enquiries', formLimiter, validate(enquirySchema), enquiryController.create);
router.post('/reviews', formLimiter, validate(reviewSchema), reviewController.create);

router.get('/enquiries', adminOnly, enquiryController.list);
router.get('/reviews', adminOnly, reviewController.list);

router.get('/posts', blogController.list);
router.get('/posts/:slug', blogController.get);

module.exports = router;
