/**
 * Declarative request-body validator.
 * schema: { field: { required, type, maxLength, pattern, oneOf, isArray } }
 */
function validate(schema) {
  return (req, res, next) => {
    const body = req.body || {};
    const errors = {};
    const clean = {};

    for (const [field, rules] of Object.entries(schema)) {
      let value = body[field];

      if (value === undefined || value === null || value === '' ||
          (Array.isArray(value) && value.length === 0)) {
        if (rules.required) errors[field] = `${rules.label || field} is required.`;
        continue;
      }

      if (rules.isArray) {
        if (!Array.isArray(value)) value = [value];
        value = value.map((v) => String(v).trim().slice(0, 120)).slice(0, 20);
        clean[field] = value;
        continue;
      }

      value = String(value).trim();

      if (rules.maxLength && value.length > rules.maxLength) {
        value = value.slice(0, rules.maxLength);
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message || `${rules.label || field} looks invalid.`;
        continue;
      }
      if (rules.oneOf && !rules.oneOf.includes(value)) {
        errors[field] = `${rules.label || field} has an unexpected value.`;
        continue;
      }
      clean[field] = value;
    }

    if (Object.keys(errors).length) {
      return res.status(422).json({ ok: false, errors });
    }
    req.validated = clean;
    next();
  };
}

const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone: /^[+()\-\s\d]{7,20}$/
};

module.exports = { validate, patterns };
