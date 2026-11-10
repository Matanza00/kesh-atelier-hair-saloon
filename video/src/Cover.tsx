import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import './theme';
import {C, F} from './theme';

export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.ink}}>
    <Img src={staticFile('hero/f080.webp')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(23,20,18,.95) 25%, rgba(23,20,18,.2) 70%)'}} />
    <AbsoluteFill style={{padding: '0 72px 120px', justifyContent: 'flex-end', gap: 24}}>
      <span style={{fontFamily: F.mono, fontSize: 28, letterSpacing: 6, color: C.gold}}>BEFORE → AFTER</span>
      <div style={{fontFamily: F.display, fontSize: 116, lineHeight: 1.02, color: C.fg}}>I rebuilt a salon website in <em style={{color: C.gold}}>3D</em></div>
      <span style={{fontFamily: F.body, fontSize: 36, color: '#d6cdc3'}}>Three.js · scroll-driven scenes · an AI voice receptionist</span>
    </AbsoluteFill>
  </AbsoluteFill>
);
