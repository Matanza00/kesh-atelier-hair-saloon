import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from './theme';
import {BrowserFrame, Chip, Cursor, Grain, ImgSeq, Shade, clampOpts, ease, rise} from './components';
import {Strands, StrandState} from './Strands';

const W = 1080, H = 1350;
const lerp = (f: number, a: number, b: number, from: number, to: number) => interpolate(f, [a, b], [from, to], {...clampOpts, easing: ease});
const calm = (f: number): StrandState => ({cut: 3.6, dye: 0, curl: 0.35, freq: 1.5, gloss: 0.35, frizz: 0.4, blade: 0, rotY: -0.1 + f * 0.0012, camZ: 4.6, x: 0, y: 0.15, alpha: 0.55});

const Serif: React.FC<{children: React.ReactNode; size: number; style?: React.CSSProperties}> = ({children, size, style}) => (
  <div style={{fontFamily: F.display, fontWeight: 400, fontSize: size, lineHeight: 1.04, letterSpacing: '-0.01em', color: C.fg, ...style}}>{children}</div>
);
const Gold: React.FC<{children: React.ReactNode}> = ({children}) => <em style={{fontStyle: 'italic', color: C.gold}}>{children}</em>;

// 1 ─ Hook
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill style={{opacity: lerp(f, 0, 30, 0, 1)}}><Strands width={W} height={H} state={calm} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(90% 70% at 30% 60%, rgba(23,20,18,.88), rgba(23,20,18,.35))'}} />
      <AbsoluteFill style={{padding: '0 84px', justifyContent: 'center', gap: 40}}>
        <Serif size={104} style={rise(f, 4)}>Your salon closes at <Gold>7&nbsp;p.m.</Gold></Serif>
        <Serif size={104} style={rise(f, 34)}>Its website shouldn't stop taking bookings.</Serif>
        <div style={{fontFamily: F.mono, fontSize: 30, letterSpacing: 3, color: C.gold, textTransform: 'uppercase', ...rise(f, 66)}}>How I rebuilt a salon site in 3D →</div>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

// 2 ─ Before
const Pain: React.FC<{text: string; at: number}> = ({text, at}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(23,20,18,.92)', border: `1px solid ${C.bad}`, padding: '14px 22px', alignSelf: 'flex-start',
      opacity: lerp(f, at, at + 10, 0, 1), scale: String(lerp(f, at, at + 14, 0.9, 1))}}>
      <span style={{width: 34, height: 34, borderRadius: 17, background: C.bad, color: C.ink, display: 'grid', placeItems: 'center', fontFamily: F.body, fontWeight: 600, fontSize: 24}}>✕</span>
      <span style={{fontFamily: F.body, fontSize: 32, color: C.fg}}>{text}</span>
    </div>
  );
};
export const Before: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const imgH = 1821 * (936 / 1920), viewH = 700;
  return (
    <AbsoluteFill style={{background: '#2a2522'}}>
      <div style={{position: 'absolute', left: 72, top: 84, display: 'flex', flexDirection: 'column', gap: 18, ...rise(f, 2)}}>
        <span style={{fontFamily: F.mono, fontSize: 26, letterSpacing: 5, color: C.ink, background: C.bad, padding: '6px 14px', alignSelf: 'flex-start'}}>BEFORE</span>
        <Serif size={76}>The usual salon website</Serif>
        <span style={{fontFamily: F.body, fontSize: 30, color: '#cfc5bb'}}>It looks fine. It just can't take a booking.</span>
      </div>
      <BrowserFrame url="salon-and-spa-template.com" light style={{position: 'absolute', left: 72, top: 360, width: 936, height: viewH + 64, ...rise(f, 8, 22)}}>
        <Img src={staticFile('shots/before-full.jpg')} style={{width: 936, height: imgH, translate: `0px ${lerp(f, 30, d - 20, 0, -(imgH - viewH))}px`}} />
      </BrowserFrame>
      <div style={{position: 'absolute', left: 104, right: 72, top: 1000, display: 'flex', flexDirection: 'column', gap: 14}}>
        <Pain at={48} text="Looks like every other template" />
        <Pain at={88} text="Stock-photo placeholders" />
        <Pain at={128} text="Booking means calling, 9 to 5" />
        <Pain at={168} text="Prices hidden: “call for pricing”" />
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// 3 ─ After title
export const AfterTitle: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill style={{opacity: 0.9}}><Strands width={W} height={H} state={fr => ({...calm(fr), dye: lerp(fr, 0, 70, 0, 1), gloss: lerp(fr, 0, 70, 0.3, 0.9), alpha: 0.9, camZ: lerp(fr, 0, 80, 5.4, 4.4)})} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(23,20,18,.9) 10%, rgba(23,20,18,.2) 60%)'}} />
      <AbsoluteFill style={{padding: '0 84px 170px', justifyContent: 'flex-end', gap: 26}}>
        <span style={{fontFamily: F.mono, fontSize: 26, letterSpacing: 5, color: C.ink, background: C.gold, padding: '6px 14px', alignSelf: 'flex-start', ...rise(f, 2)}}>AFTER</span>
        <Serif size={132} style={{textTransform: 'uppercase', ...rise(f, 8)}}>Kesh <Gold>Atelier</Gold></Serif>
        <span style={{fontFamily: F.body, fontSize: 36, color: '#ddd3c8', lineHeight: 1.35, ...rise(f, 22)}}>A cinematic, 3D, scroll-driven website that takes bookings on its own.</span>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};

// 4 ─ Hero scrub
export const Hero: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill style={{scale: String(lerp(f, 0, 210, 1.06, 1.0))}}><ImgSeq dir="hero" count={120} from={1} to={120} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(75deg, rgba(23,20,18,.75), rgba(23,20,18,.1) 70%)'}} />
      <Shade strength={0.9} />
      <AbsoluteFill style={{padding: '0 72px 210px', justifyContent: 'flex-end', opacity: lerp(f, 120, 150, 1, 0)}}>
        <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: 5, color: C.gold, ...rise(f, 10)}}>HAIR &amp; BEAUTY SALON</div>
        <Serif size={112} style={{textTransform: 'uppercase', marginTop: 18, ...rise(f, 16)}}>Hair that tells <Gold>your</Gold> story</Serif>
      </AbsoluteFill>
      <Chip n="01" title="Scroll-scrubbed cinematic hero" sub="120 video frames painted onto a canvas, so the camera moves exactly as fast as you scroll." />
      <div style={{position: 'absolute', left: 72, bottom: 88, fontFamily: F.mono, fontSize: 24, color: C.mist, display: 'flex', gap: 16, alignItems: 'center'}}>
        <span style={{width: 12, height: 12, borderRadius: 6, background: '#62c655'}} />kesh-atelier.vercel.app
        <span style={{marginLeft: 'auto', color: C.gold}}>frame {String(Math.round(lerp(f, 0, 209, 1, 120))).padStart(3, '0')} / 120</span>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// 5 ─ Three.js strands
const steps = ['Cut', 'Color', 'Curl', 'Shine'];
export const ThreeD: React.FC = () => {
  const f = useCurrentFrame();
  const st = (fr: number): StrandState => ({
    cut: lerp(fr, 40, 95, 4, 2.05), dye: lerp(fr, 100, 150, 0, 1), curl: lerp(fr, 145, 190, 0, 1), freq: 1.5,
    gloss: lerp(fr, 180, 220, 0.1, 1), frizz: lerp(fr, 180, 220, 1, 0), blade: fr > 40 && fr < 95 ? Math.sin(((fr - 40) / 55) * Math.PI) : 0,
    rotY: lerp(fr, 0, 225, -0.18, 0.16), camZ: lerp(fr, 0, 225, 5.3, 4.7), x: 0, y: -0.05, alpha: 1,
  });
  const active = f < 95 ? 0 : f < 145 ? 1 : f < 185 ? 2 : 3;
  return (
    <AbsoluteFill style={{background: `radial-gradient(70% 55% at 50% 55%, #2a1d16, ${C.ink})`}}>
      <AbsoluteFill style={{top: 120}}><Strands width={W} height={H} state={st} /></AbsoluteFill>
      <Shade bottom={false} strength={0.95} />
      <Chip n="02" title="Three.js hair, 3,000 GPU strands" sub="Cut, color, curl and shine are shader values tied to the scroll position." />
      <div style={{position: 'absolute', left: 72, right: 72, bottom: 90, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14}}>
        {steps.map((s, i) => (
          <div key={s} style={{borderTop: `3px solid ${i <= active ? C.gold : C.line}`, paddingTop: 14, fontFamily: F.mono, fontSize: 26, letterSpacing: 3, textTransform: 'uppercase', color: i === active ? C.fg : C.mist}}>{String(i + 1).padStart(2, '0')} {s}</div>
        ))}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// 6 ─ Service scenes
const svc = [['cut', 'Cut', 64, 'Where precision meets flow'], ['colour', 'Color', 64, 'Color mixed by hand'], ['style', 'Style', 63, 'Movement that lasts all night'], ['care', 'Care', 63, 'Repair from within']] as const;
export const Services: React.FC = () => {
  const f = useCurrentFrame();
  const seg = 52;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {svc.map(([dir, name, count, line], i) => (
        <Sequence key={dir} from={i * seg} durationInFrames={i === 3 ? 210 - 3 * seg : seg} name={name}>
          <SvcShot dir={dir} name={name} count={count} line={line} idx={i} />
        </Sequence>
      ))}
      <Shade bottom={false} strength={0.92} />
      <Chip n="03" title="Scroll-driven service scenes" sub="The section pins in place and each service plays its own clip as you scroll." />
      <Grain />
    </AbsoluteFill>
  );
};
const SvcShot: React.FC<{dir: string; name: string; count: number; line: string; idx: number}> = ({dir, name, count, line, idx}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: lerp(f, 0, 8, 0, 1)}}>
      <AbsoluteFill style={{scale: String(lerp(f, 0, 60, 1.12, 1.02))}}><ImgSeq dir={`svc/${dir}`} count={count} from={4} to={count - 4} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(23,20,18,.9) 0%, rgba(23,20,18,0) 45%)'}} />
      <div style={{position: 'absolute', left: 72, bottom: 120, display: 'flex', flexDirection: 'column', gap: 12}}>
        <span style={{fontFamily: F.mono, fontSize: 24, letterSpacing: 4, color: C.gold, ...rise(f, 2, 12)}}>SCENE 0{idx + 1} · {name.toUpperCase()}</span>
        <Serif size={78} style={{textTransform: 'uppercase', ...rise(f, 5, 14)}}>{line}</Serif>
      </div>
    </AbsoluteFill>
  );
};

// 7 ─ Before / after slider
export const Compare: React.FC = () => {
  const f = useCurrentFrame();
  const split = interpolate(f, [10, 55, 105, 140], [50, 14, 86, 50], {...clampOpts, easing: ease});
  const bw = 800, bh = 1000, left = (W - bw) / 2, top = 300;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Chip n="04" title="Drag to compare results" sub="Real client-style before and after, one slider." />
      <div style={{position: 'absolute', left, top, width: bw, height: bh, overflow: 'hidden', border: `1px solid ${C.line}`, ...rise(f, 4, 20)}}>
        <Img src={staticFile('ba/before.webp')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
        <Img src={staticFile('ba/after.webp')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', clipPath: `inset(0 0 0 ${split}%)`}} />
        <span style={{position: 'absolute', top: 22, left: 22, fontFamily: F.mono, fontSize: 22, letterSpacing: 4, background: 'rgba(23,20,18,.88)', color: C.fg, padding: '8px 14px'}}>BEFORE</span>
        <span style={{position: 'absolute', top: 22, right: 22, fontFamily: F.mono, fontSize: 22, letterSpacing: 4, background: C.gold, color: C.ink, padding: '8px 14px'}}>AFTER</span>
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${split}%`, width: 3, marginLeft: -1.5, background: C.fg}}>
          <div style={{position: 'absolute', top: '50%', left: '50%', width: 74, height: 74, marginLeft: -37, marginTop: -37, borderRadius: 37, background: C.fg, color: C.ink, display: 'grid', placeItems: 'center', fontFamily: F.body, fontSize: 30, fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,.45)'}}>‹ ›</div>
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// 8 ─ Booking popup
export const Booking: React.FC = () => {
  const f = useCurrentFrame();
  const z = lerp(f, 20, 80, 1, 1.62);
  const click = 128, pressed = f >= click && f < click + 6;
  const cx = interpolate(f, [70, 122], [800, 300], {...clampOpts, easing: ease}), cy = interpolate(f, [70, 122], [1250, 1122], {...clampOpts, easing: ease});
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Chip n="05" title="Book Now opens a popup" sub="No jump to the bottom of the page. Live open times, US phone check, no double bookings." />
      <BrowserFrame url="kesh-atelier.vercel.app" style={{position: 'absolute', left: 72, top: 300, width: 936, height: 930, ...rise(f, 2, 20)}}>
        <AbsoluteFill style={{background: '#0f0d0c'}}>
          <Img src={staticFile('shots/kesh-modal.jpg')} style={{width: 936, height: 585, position: 'absolute', top: 115, scale: String(z), transformOrigin: '50% 38%', translate: `0px ${lerp(f, 60, 100, 0, -60)}px`}} />
        </AbsoluteFill>
      </BrowserFrame>
      <Cursor x={cx} y={cy} pressed={pressed} />
      {f >= click + 4 ? (
        <div style={{position: 'absolute', left: 120, right: 120, top: 560, background: C.ink2, border: `1px solid ${C.gold}`, padding: '34px 40px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 30px 80px rgba(0,0,0,.6)', ...rise(f, click + 4, 14)}}>
          <span style={{fontFamily: F.mono, fontSize: 22, letterSpacing: 4, color: C.gold}}>REQUEST RECEIVED</span>
          <Serif size={56}>See you soon, Jane.</Serif>
          <span style={{fontFamily: F.body, fontSize: 28, color: '#d6cdc3'}}>Balayage with Grace Whitman · Wed, Nov 11 at 2:00 PM</span>
        </div>
      ) : null}
      <Grain />
    </AbsoluteFill>
  );
};

// 9 ─ Ava
export const Ava: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill style={{opacity: 0.35}}><Img src={staticFile('shots/kesh-ava-page.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(10px)'}} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(23,20,18,.95) 0%, rgba(23,20,18,.55) 40%, rgba(23,20,18,.9) 100%)'}} />
      <Chip n="06" title="Ava, an AI voice receptionist" sub="Built on ElevenLabs Agents. She checks real open times and fills in the same booking form while you talk." />
      <div style={{position: 'absolute', left: (W - 470) / 2, top: 380, width: 470, ...rise(f, 10, 22)}}>
        <Img src={staticFile('shots/kesh-ava-panel.jpg')} style={{width: 470, boxShadow: '0 40px 90px rgba(0,0,0,.6)'}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, height: 70}}>
        {Array.from({length: 34}).map((_, i) => {
          const h = 10 + Math.abs(Math.sin(f * 0.22 + i * 0.7) * Math.sin(f * 0.05 + i * 0.31)) * 54;
          return <span key={i} style={{width: 7, height: h, borderRadius: 4, background: i % 5 === 0 ? C.fg : C.gold, opacity: 0.9}} />;
        })}
      </div>
      <span style={{position: 'absolute', left: 0, right: 0, bottom: 30, textAlign: 'center', fontFamily: F.mono, fontSize: 20, letterSpacing: 3, color: C.mist}}>EXAMPLE CONVERSATION</span>
      <Grain />
    </AbsoluteFill>
  );
};

// 10 ─ Lessons
const lessons = [
  ['Scrub image frames, not a video tag.', 'Seeking a <video> stutters. Drawing pre-cut frames to a canvas stays smooth.'],
  ['One WebGL canvas for all the 3D.', 'A single fixed Three.js canvas draws each section into its own window.'],
  ['Give the AI the same form as people.', 'Ava’s tools fill the booking form, and the server still checks the slot.'],
];
export const Lessons: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink, padding: '96px 72px', gap: 54}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, ...rise(f, 2)}}>
        <span style={{fontFamily: F.mono, fontSize: 24, letterSpacing: 5, color: C.gold}}>FOR DEVELOPERS</span>
        <Serif size={84}>3 things I learned building it</Serif>
      </div>
      {lessons.map(([t, s], i) => (
        <div key={t} style={{display: 'grid', gridTemplateColumns: '96px 1fr', gap: 20, borderTop: `1px solid ${C.line}`, paddingTop: 30, ...rise(f, 24 + i * 58)}}>
          <span style={{fontFamily: F.display, fontSize: 76, lineHeight: 1, color: 'transparent', WebkitTextStroke: `1.5px ${C.gold}`}}>{i + 1}</span>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <span style={{fontFamily: F.body, fontWeight: 600, fontSize: 40, color: C.fg, lineHeight: 1.2}}>{t}</span>
            <span style={{fontFamily: F.body, fontSize: 30, color: '#cfc5bb', lineHeight: 1.4}}>{s}</span>
          </div>
        </div>
      ))}
      <div style={{marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 12, ...rise(f, 200)}}>
        {['Three.js', 'GSAP ScrollTrigger', 'Lenis', 'ElevenLabs Agents', 'Vercel'].map(s => (
          <span key={s} style={{fontFamily: F.mono, fontSize: 24, color: C.fg, border: `1px solid ${C.line}`, padding: '10px 18px'}}>{s}</span>
        ))}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// 11 ─ End card
export const End: React.FC = () => {
  const f = useCurrentFrame();
  const row = (label: string, value: string, at: number) => (
    <div style={{display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'baseline', gap: 18, borderTop: `1px solid ${C.line}`, paddingTop: 22, ...rise(f, at)}}>
      <span style={{fontFamily: F.mono, fontSize: 22, letterSpacing: 4, color: C.mist}}>{label}</span>
      <span style={{fontFamily: F.mono, fontSize: 32, color: C.fg}}>{value}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill style={{opacity: 0.5}}><Strands width={W} height={H} state={fr => ({...calm(fr), dye: 1, gloss: 1, frizz: 0, curl: 0.55, cut: 2.6, y: 0.5, alpha: 0.75})} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(23,20,18,.97) 30%, rgba(23,20,18,.55) 75%)'}} />
      <AbsoluteFill style={{padding: '0 72px 110px', justifyContent: 'flex-end', gap: 26}}>
        <span style={{fontFamily: F.mono, fontSize: 26, letterSpacing: 6, color: C.gold, ...rise(f, 2)}}>MADE BY</span>
        <Serif size={124} style={rise(f, 6)}>Usman <Gold>Nadeem</Gold></Serif>
        <span style={{fontFamily: F.body, fontSize: 34, color: '#d6cdc3', marginBottom: 20, ...rise(f, 14)}}>Creative developer · 3D and interactive web</span>
        {row('LIVE', 'kesh-atelier.vercel.app', 26)}
        {row('GITHUB', 'github.com/Matanza00', 34)}
        {row('REPO', 'Matanza00/kesh-atelier-hair-saloon', 42)}
        <span style={{marginTop: 26, alignSelf: 'flex-start', fontFamily: F.body, fontWeight: 600, fontSize: 32, color: C.ink, background: C.gold, padding: '16px 26px', opacity: lerp(f, 58, 72, 0, 1)}}>Public repo · Contributions welcome</span>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
