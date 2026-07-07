const store = require('../models/store');

async function create(req, res, next) {
  try {
    const request = await store.insert('review-requests', {
      type: 'free-website-review',
      ...req.validated
    });
    res.status(201).json({
      ok: true,
      id: request.id,
      message: 'Done! Your free review is booked. We will send your report on WhatsApp within 48 hours.'
    });
  } catch (err) {
    next(err);
  }
}

function list(req, res) {
  res.json({ ok: true, requests: store.all('review-requests') });
}

module.exports = { create, list };
