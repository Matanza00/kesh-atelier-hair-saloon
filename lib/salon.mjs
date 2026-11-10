// Salon facts shared by the booking API. Keep in sync with the SALON object in index.html.
export const TZ = 'America/Denver';
export const PHONE = '+1 (406) 555-0147';
// [opening hour, closing hour] by weekday, 0 = Sunday. null = closed. Last start is one hour before closing.
export const HOURS = [[10, 16], null, [10, 19], [10, 19], [10, 19], [10, 19], [9, 18]];
export const SERVICES = [
  'Free consultation',
  'Signature cut & finish', 'Layers & texture', 'Bang trim', "Men's cut & beard line", 'Kids cut (under 10)',
  'Global color', 'Balayage', 'Root touch-up', 'Highlights', 'Gloss & toner',
  'Blowout & finish', 'Curls or soft waves', 'Event updo', 'Bridal hair (trial included)',
  'Keratin smoothing', 'Bond repair', 'Scalp ritual', 'Hair spa'
];
export const STYLISTS = ['First available', 'Olivia Hart', 'Grace Whitman', 'Emma Lawson', 'Jack Turner'];
// How many appointments can start at the same time (one per named stylist).
export const CHAIRS = STYLISTS.length - 1;

const pad = n => String(n).padStart(2, '0');
export const todayISO = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export function nowMinutes() {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const g = t => +p.find(x => x.type === t).value;
  return g('hour') * 60 + g('minute');
}
export const dow = iso => new Date(iso + 'T12:00:00Z').getUTCDay();
export function slotsFor(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return [];
  const hrs = HOURS[dow(iso)];
  if (!hrs) return [];
  const today = iso === todayISO(), now = today ? nowMinutes() : 0, out = [];
  for (let t = hrs[0] * 60; t <= (hrs[1] - 1) * 60; t += 30) {
    if (today && t <= now + 60) continue;
    out.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
  }
  return out;
}
export function normPhone(s) {
  let d = String(s || '').replace(/\D/g, '');
  if (d.length === 11 && d[0] === '1') d = d.slice(1);
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : null;
}
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);

// Returns {booking} or {error, field}.
export function checkBooking(input) {
  const b = {
    service: clean(input.service, 80),
    stylist: clean(input.stylist, 60) || 'First available',
    date: clean(input.date, 10),
    time: clean(input.time, 5),
    name: clean(input.name, 80),
    phone: normPhone(input.phone),
    email: clean(input.email, 120),
    notes: clean(input.notes, 600),
    source: input.source === 'ava' ? 'ava' : 'website'
  };
  if (!SERVICES.includes(b.service)) return { error: 'Choose a service from the menu.', field: 'service' };
  if (!STYLISTS.includes(b.stylist)) return { error: 'Choose a stylist from the list.', field: 'stylist' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date)) return { error: 'Choose a date.', field: 'date' };
  if (b.date < todayISO()) return { error: 'That date has passed. Please choose another day.', field: 'date' };
  const slots = slotsFor(b.date);
  if (!slots.length) return { error: dow(b.date) === 1 ? 'We are closed on Mondays. Please choose another day.' : 'There are no times left that day.', field: 'date' };
  if (!slots.includes(b.time)) return { error: 'Choose a time within opening hours.', field: 'time' };
  if (b.name.length < 2) return { error: 'Add your name.', field: 'name' };
  if (!b.phone) return { error: 'Add a 10-digit US mobile number.', field: 'phone' };
  if (b.email && !/^\S+@\S+\.\S+$/.test(b.email)) return { error: 'Check your email address.', field: 'email' };
  return { booking: b };
}
