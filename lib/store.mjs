// Booking requests live in a private Vercel Blob store connected to this project
// (Vercel sets BLOB_READ_WRITE_TOKEN when the store is connected).
import { put, list, get } from '@vercel/blob';

export const storeReady = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

const json = { access: 'private', addRandomSuffix: false, contentType: 'application/json' };
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// All claimed slots for a day: [{ time, who }] where who is a stylist slug or "any-<ref>".
export async function slotsTaken(date) {
  const out = [];
  let cursor;
  do {
    const page = await list({ prefix: `slots/${date}/`, limit: 1000, cursor });
    page.blobs.forEach(b => {
      const [, , time, file] = b.pathname.split('/');
      if (time && file) out.push({ time: time.replace('-', ':'), who: file.replace(/\.json$/, '') });
    });
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

// Claims a slot. Returns false when that exact claim already exists.
export async function claimSlot(date, time, who, record) {
  try {
    await put(`slots/${date}/${time.replace(':', '-')}/${who}.json`, JSON.stringify(record), json);
    return true;
  } catch (e) {
    if (/already exists/i.test(e.message || '')) return false;
    throw e;
  }
}

export async function saveBooking(record) {
  await put(`bookings/${record.createdAt.replace(/[:.]/g, '-')}-${record.ref}.json`, JSON.stringify(record), json);
}

export async function listBookings(max = 300) {
  const page = await list({ prefix: 'bookings/', limit: 1000 });
  const blobs = page.blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1)).slice(0, max);
  const rows = await Promise.all(blobs.map(async b => {
    try { const r = await get(b.pathname, { access: 'private' }); return JSON.parse(await new Response(r.stream).text()); }
    catch (e) { return null; }
  }));
  return rows.filter(Boolean);
}

export const stylistKey = name => slug(name);

export function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(body);
}
