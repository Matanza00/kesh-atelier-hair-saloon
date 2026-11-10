import { listBookings, storeReady, send } from '../lib/store.mjs';

// GET /api/bookings with header "x-admin-key: <ADMIN_KEY>"  ->  latest 300 booking requests
export default async function handler(req, res) {
  const key = process.env.ADMIN_KEY;
  if (!key || req.headers['x-admin-key'] !== key) return send(res, 401, { error: 'Wrong admin key.' });
  if (!storeReady()) return send(res, 503, { error: 'Booking storage is not connected.' });
  try { send(res, 200, { bookings: await listBookings() }); }
  catch (e) { console.error('bookings failed', e); send(res, 500, { error: 'Could not read bookings.' }); }
}
