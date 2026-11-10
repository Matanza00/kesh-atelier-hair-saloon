import { slotsFor, STYLISTS, CHAIRS } from '../lib/salon.mjs';
import { redis, storeReady, send } from '../lib/store.mjs';

// GET /api/availability?date=YYYY-MM-DD&stylist=Name  ->  { date, stylist, free: ["10:00", ...] }
export default async function handler(req, res) {
  const date = String(req.query.date || '');
  const stylist = STYLISTS.includes(req.query.stylist) ? req.query.stylist : 'First available';
  const slots = slotsFor(date);
  if (!slots.length || !storeReady()) return send(res, 200, { date, stylist, free: slots });
  try {
    const [taken, ...counts] = await redis([['SMEMBERS', `taken:${date}`], ...slots.map(t => ['GET', `count:${date}|${t}`])]);
    const takenSet = new Set(taken || []);
    const free = slots.filter((t, i) => {
      if (Number(counts[i] || 0) >= CHAIRS) return false;
      return stylist === 'First available' || !takenSet.has(`${stylist}|${t}`);
    });
    send(res, 200, { date, stylist, free });
  } catch (e) {
    send(res, 200, { date, stylist, free: slots, note: 'availability unknown' });
  }
}
