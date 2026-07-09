/*
 * Enquiry + review form submission.
 * Client-side validation + submit to a Formspree endpoint (set on the
 * form's data-endpoint attribute). Works on any static host (Bluehost,
 * Netlify, etc.) with no backend. See DEPLOY.md to connect Formspree.
 */
(function () {
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE = /^[+()\-\s\d]{7,20}$/;

  function labelText(el) {
    const field = el.closest('.field') || el.closest('fieldset');
    const lab = field && field.querySelector('label, legend');
    return lab ? lab.textContent.replace('*', '').trim().replace(/\s+/g, ' ') : el.name;
  }

  function setStatus(form, type, message) {
    const box = form.querySelector('.form-status');
    if (!box) return;
    box.className = `form-status ${type}`;
    box.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        ${type === 'success' ? '<path d="M22 11.1V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>' : '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'}
      </svg>
      <span>${message}</span>`;
    box.setAttribute('role', 'alert');
  }

  function clearErrors(form) {
    form.querySelectorAll('.field.invalid').forEach((f) => f.classList.remove('invalid'));
  }

  function showErrors(form, errors) {
    let first = null;
    for (const [name, msg] of Object.entries(errors)) {
      let field, span;
      if (name === 'services') {
        span = form.querySelector('[data-for="services"]');
        field = span && span.closest('.field');
      } else {
        const input = form.querySelector(`[name="${name}"]`);
        field = input && input.closest('.field');
        span = field && field.querySelector('.error-msg');
      }
      if (field) {
        field.classList.add('invalid');
        if (span) span.textContent = msg;
        if (!first) first = field.querySelector('input, select, textarea');
      }
    }
    if (first && first.focus) first.focus();
  }

  // Mirrors the old server-side validation so submissions are checked before send.
  function validate(form) {
    const errors = {};
    form.querySelectorAll('[required]').forEach((el) => {
      if (el.type === 'checkbox' || el.type === 'radio') return;
      if (!el.value.trim()) errors[el.name] = `${labelText(el)} is required.`;
    });
    form.querySelectorAll('input[type="email"]').forEach((el) => {
      if (el.value.trim() && !EMAIL.test(el.value.trim())) errors[el.name] = 'Enter a valid email address.';
    });
    form.querySelectorAll('input[type="tel"]').forEach((el) => {
      if (el.value.trim() && !PHONE.test(el.value.trim())) {
        errors[el.name] = 'Enter a valid WhatsApp number, e.g. +960 998-7899.';
      }
    });
    const grp = form.dataset.groupRequired;
    if (grp && ![...form.querySelectorAll(`input[name="${grp}"]`)].some((c) => c.checked)) {
      errors[grp] = 'Please select at least one option.';
    }
    form.querySelectorAll('input[type="checkbox"][required]').forEach((cb) => {
      if (!cb.checked) errors[cb.name] = 'Please tick this box to continue.';
    });
    return errors;
  }

  function collect(form) {
    const data = {};
    const fd = new FormData(form);
    for (const [key, value] of fd.entries()) {
      if (key in data) {
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }
    return data;
  }

  async function handleSubmit(form) {
    const endpoint = form.dataset.endpoint || '';
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    clearErrors(form);
    const errors = validate(form);
    if (Object.keys(errors).length) {
      setStatus(form, 'error', 'Please fix the highlighted fields and try again.');
      showErrors(form, errors);
      return;
    }

    // Guard: form not yet connected to a real endpoint.
    if (!endpoint || /YOUR_.*_ID/.test(endpoint)) {
      setStatus(form, 'error', 'This form is not connected yet. Add your Formspree form ID (see DEPLOY.md), or message us on WhatsApp.');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending…';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(collect(form))
      });

      if (res.ok) {
        setStatus(form, 'success', form.dataset.success || 'Thank you! We received your message and will reply within one working day.');
        form.reset();
        form.querySelector('.form-status').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Formspree returns { errors: [{ field, message }] } on validation failure.
      let json = {};
      try { json = await res.json(); } catch { /* ignore */ }
      if (Array.isArray(json.errors) && json.errors.length) {
        const map = {};
        json.errors.forEach((e) => { map[e.field || '_form'] = e.message; });
        setStatus(form, 'error', 'Please check the highlighted fields and try again.');
        showErrors(form, map);
      } else {
        setStatus(form, 'error', 'Something went wrong. Please try again, or message us on WhatsApp.');
      }
    } catch {
      setStatus(form, 'error', 'Could not send right now. Please check your connection, or message us on WhatsApp.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[data-endpoint]').forEach((form) => {
      form.setAttribute('novalidate', '');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit(form);
      });
      form.addEventListener('input', (e) => {
        e.target.closest('.field')?.classList.remove('invalid');
      });
      form.addEventListener('change', (e) => {
        if (e.target.name === form.dataset.groupRequired) {
          form.querySelector('[data-for="services"]')?.closest('.field')?.classList.remove('invalid');
        }
      });
    });
  });
})();
