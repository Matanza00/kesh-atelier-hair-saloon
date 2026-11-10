import { slotsFor, STYLISTS, CHAIRS } from '../lib/salon.mjs';
import { slotsTaken, stylistKey, storeReady, send } from '../lib/store.mjs';

// GET /api/availability?date=YYYY-MM-DD&stylist=Name  ->  { date, stylist, free: ["10:00", ...] }
export default async function handler(req, res) {
  const date = String(req.query.date || '');
  const stylist = STYLISTS.includes(req.query.stylist) ? req.query.stylist : 'First available';
  const slots = slotsFor(date);
  if (!slots.length || !storeReady()) return send(res, 200, { date, stylist, free: slots });
  try {
    const taken = await slotsTaken(date);
    const key = stylistKey(stylist);
    const free = slots.filter(t => {
      const here = taken.filter(x => x.time === t);
      if (here.length >= CHAIRS) return false;
      return stylist === 'First available' || !here.some(x => x.who === key);
    });
    send(res, 200, { date, stylist, free });
  } catch (e) {
    console.error('availability failed', e);
    send(res, 200, { date, stylist, free: slots, note: 'availability unknown' });
  }
}
