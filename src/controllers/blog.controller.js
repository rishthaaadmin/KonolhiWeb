const store = require('../models/store');

function list(req, res) {
  const posts = store
    .all('posts')
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  res.json({ ok: true, posts });
}

function get(req, res) {
  const post = store.all('posts').find((p) => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ ok: false, error: 'Post not found' });
  res.json({ ok: true, post });
}

module.exports = { list, get };
