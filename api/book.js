import { checkBooking, CHAIRS, PHONE } from '../lib/salon.mjs';
import { slotsTaken, claimSlot, saveBooking, stylistKey, storeReady, send } from '../lib/store.mjs';

const refCode = () => 'KA-' + Array.from({ length: 5 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');

// POST /api/book  { service, stylist, date, time, name, phone, email?, notes?, source? }
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Use POST.' });
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  if (body.company) return send(res, 200, { ok: true, ref: refCode() }); // spam trap was filled in
  const { booking, error, field } = checkBooking(body);
  if (error) return send(res, 400, { error, field });
  if (!storeReady()) return send(res, 503, { error: `Online booking isn't switched on yet. Please call or text ${PHONE}.` });

  try {
    const taken = (await slotsTaken(booking.date)).filter(x => x.time === booking.time);
    const named = booking.stylist !== 'First available';
    const key = named ? stylistKey(booking.stylist) : null;
    if (named && taken.some(x => x.who === key)) return send(res, 409, { error: `${booking.stylist} is already booked at that time. Please choose another time.`, field: 'time' });
    if (taken.length >= CHAIRS) return send(res, 409, { error: 'That time is fully booked. Please choose another time.', field: 'time' });

    const ref = refCode();
    const record = { ref, ...booking, createdAt: new Date().toISOString() };
    const claimed = await claimSlot(booking.date, booking.time, named ? key : `any-${ref.toLowerCase()}`, { ref });
    if (!claimed) return send(res, 409, { error: `${booking.stylist} was just booked at that time. Please choose another time.`, field: 'time' });
    await saveBooking(record);
    send(res, 200, { ok: true, ref, booking: record });
  } catch (e) {
    console.error('book failed', e);
    send(res, 500, { error: `We couldn't save your request just now. Please call or text ${PHONE}.` });
  }
}
