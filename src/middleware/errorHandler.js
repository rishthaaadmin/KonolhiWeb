function notFound(req, res) {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ ok: false, error: 'Not found' });
  }
  res.status(404).sendFile('404.html', { root: 'public' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    error: status === 500 ? 'Something went wrong. Please try again.' : err.message
  });
}

module.exports = { notFound, errorHandler };
