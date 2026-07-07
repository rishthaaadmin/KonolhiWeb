const store = require('../models/store');

async function create(req, res, next) {
  try {
    const enquiry = await store.insert('enquiries', {
      type: 'project-enquiry',
      ...req.validated
    });
    res.status(201).json({
      ok: true,
      id: enquiry.id,
      message: 'Thank you! We received your enquiry and will reply on WhatsApp within one working day.'
    });
  } catch (err) {
    next(err);
  }
}

function list(req, res) {
  res.json({ ok: true, enquiries: store.all('enquiries') });
}

module.exports = { create, list };
