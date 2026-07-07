/**
 * Minimal JSON-file datastore. Each collection is a file in /data.
 * Writes are atomic (write temp file, then rename) and serialized
 * per collection to avoid interleaved writes.
 */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const locks = new Map(); // collection -> promise chain

function fileFor(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readSync(collection) {
  const file = fileFor(collection);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

async function writeAtomic(collection, records) {
  const file = fileFor(collection);
  const tmp = `${file}.${process.pid}.tmp`;
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.writeFile(tmp, JSON.stringify(records, null, 2), 'utf8');
  await fsp.rename(tmp, file);
}

function withLock(collection, fn) {
  const prev = locks.get(collection) || Promise.resolve();
  const next = prev.then(fn, fn);
  locks.set(collection, next.catch(() => {}));
  return next;
}

module.exports = {
  all(collection) {
    return readSync(collection);
  },

  insert(collection, record) {
    return withLock(collection, async () => {
      const records = readSync(collection);
      const entry = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...record
      };
      records.push(entry);
      await writeAtomic(collection, records);
      return entry;
    });
  }
};
