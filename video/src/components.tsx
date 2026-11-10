import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from './theme';

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const clampOpts = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
export const rise = (frame: number, start: number, dur = 18) => ({
  opacity: interpolate(frame, [start, start + dur], [0, 1], {...clampOpts, easing: ease}),
  translate: interpolate(frame, [start, start + dur], ['0px 34px', '0px 0px'], {...clampOpts, easing: ease}),
});

// Frame-accurate image sequence (the site's own scroll-scrubbed frames).
export const ImgSeq: React.FC<{dir: string; count: number; from: number; to: number; style?: React.CSSProperties; pad?: number}> = ({dir, count, from, to, style, pad = 3}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const i = Math.round(interpolate(frame, [0, durationInFrames - 1], [from, to], clampOpts));
  const idx = Math.min(count, Math.max(1, i));
  return <Img src={staticFile(`${dir}/f${String(idx).padStart(pad, '0')}.webp`)} style={{width: '100%', height: '100%', objectFit: 'cover', ...style}} />;
};

// Feature label: number + title + one-line explanation.
export const Chip: React.FC<{n: string; title: string; sub?: string; start?: number; top?: number; dark?: boolean}> = ({n, title, sub, start = 6, top = 92, dark = true}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 72, right: 72, top, display: 'flex', flexDirection: 'column', gap: 14, ...rise(frame, start)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <span style={{fontFamily: F.mono, fontSize: 26, letterSpacing: 4, color: C.ink, background: C.gold, padding: '6px 14px'}}>{n}</span>
        <span style={{fontFamily: F.body, fontWeight: 600, fontSize: 44, color: dark ? C.fg : C.ink, lineHeight: 1.1}}>{title}</span>
      </div>
      {sub ? <span style={{fontFamily: F.body, fontSize: 30, color: dark ? '#d6cdc3' : '#5e564e', lineHeight: 1.35, maxWidth: 900}}>{sub}</span> : null}
    </div>
  );
};

export const Shade: React.FC<{top?: boolean; bottom?: boolean; strength?: number}> = ({top = true, bottom = true, strength = 0.85}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: [
    top ? `linear-gradient(180deg, rgba(23,20,18,${strength}) 0%, rgba(23,20,18,0) 38%)` : '',
    bottom ? `linear-gradient(0deg, rgba(23,20,18,${strength}) 0%, rgba(23,20,18,0) 42%)` : '',
  ].filter(Boolean).join(',')}} />
);

export const BrowserFrame: React.FC<{url: string; children: React.ReactNode; style?: React.CSSProperties; light?: boolean}> = ({url, children, style, light}) => (
  <div style={{borderRadius: 22, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,.55)', border: `1px solid ${light ? 'rgba(0,0,0,.12)' : 'rgba(242,236,228,.16)'}`, background: light ? '#fff' : C.ink2, display: 'flex', flexDirection: 'column', ...style}}>
    <div style={{height: 64, flex: '0 0 64px', display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', background: light ? '#ecebea' : '#26211d'}}>
      {['#ef6a5f', '#f4be4f', '#62c655'].map(c => <span key={c} style={{width: 15, height: 15, borderRadius: 8, background: c}} />)}
      <div style={{marginLeft: 18, flex: 1, height: 38, borderRadius: 19, background: light ? '#fff' : '#171412', display: 'flex', alignItems: 'center', padding: '0 20px', fontFamily: F.mono, fontSize: 21, color: light ? '#555' : C.mist}}>{url}</div>
    </div>
    <div style={{position: 'relative', flex: 1, overflow: 'hidden'}}>{children}</div>
  </div>
);

export const Cursor: React.FC<{x: number; y: number; pressed?: boolean}> = ({x, y, pressed}) => (
  <svg width={52} height={52} viewBox="0 0 24 24" style={{position: 'absolute', left: x, top: y, scale: pressed ? '0.86' : '1', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))'}}>
    <path d="M4 2.5l15 9.2-6.7 1.4 3.9 7.3-3 1.6-3.9-7.3L4.5 19z" fill="#fff" stroke="#111" strokeWidth={1.2} strokeLinejoin="round" />
  </svg>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const o = (frame * 37) % 160;
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.07, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundPosition: `${o}px ${-o}px`}} />;
};
