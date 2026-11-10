import { checkBooking, CHAIRS, PHONE } from '../lib/salon.mjs';
import { redis, storeReady, send } from '../lib/store.mjs';

const refCode = () => 'KA-' + Array.from({ length: 5 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');

// POST /api/book  { service, stylist, date, time, name, phone, email?, notes?, source? }
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Use POST.' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  if (body.company) return send(res, 200, { ok: true, ref: refCode() }); // spam trap filled in
  const { booking, error, field } = checkBooking(body);
  if (error) return send(res, 400, { error, field });
  if (!storeReady()) return send(res, 503, { error: `Online booking isn't switched on yet. Please call or text ${PHONE}.` });

  const slotKey = `${booking.stylist}|${booking.time}`;
  const countKey = `count:${booking.date}|${booking.time}`;
  try {
    if (booking.stylist !== 'First available') {
      const [added] = await redis([['SADD', `taken:${booking.date}`, slotKey]]);
      if (!added) return send(res, 409, { error: `${booking.stylist} is already booked at that time. Please choose another time.`, field: 'time' });
    }
    const [count] = await redis([['INCR', countKey]]);
    if (count > CHAIRS) {
      const undo = [['DECR', countKey]];
      if (booking.stylist !== 'First available') undo.push(['SREM', `taken:${booking.date}`, slotKey]);
      await redis(undo);
      return send(res, 409, { error: 'That time is fully booked. Please choose another time.', field: 'time' });
    }
    const ref = refCode();
    const record = { ref, ...booking, createdAt: new Date().toISOString() };
    await redis([['LPUSH', 'bookings', JSON.stringify(record)]]);
    send(res, 200, { ok: true, ref, booking: record });
  } catch (e) {
    console.error('book failed', e);
    send(res, 500, { error: `We couldn't save your request just now. Please call or text ${PHONE}.` });
  }
}
