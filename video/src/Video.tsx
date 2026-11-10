import React from 'react';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import './theme';
import {AfterTitle, Ava, Before, Booking, Compare, End, Hero, Hook, Lessons, Services, ThreeD} from './Scenes';

export const SCENES = [
  {name: 'Hook', c: Hook, d: 120},
  {name: 'Before', c: Before, d: 255},
  {name: 'After title', c: AfterTitle, d: 84},
  {name: 'Hero scrub', c: Hero, d: 210},
  {name: 'Three.js strands', c: ThreeD, d: 225},
  {name: 'Service scenes', c: Services, d: 210},
  {name: 'Before/after slider', c: Compare, d: 165},
  {name: 'Booking popup', c: Booking, d: 195},
  {name: 'Ava', c: Ava, d: 240},
  {name: 'Lessons', c: Lessons, d: 270},
  {name: 'End card', c: End, d: 240},
] as const;
export const T = 12;
export const TOTAL = SCENES.reduce((a, s) => a + s.d, 0) - T * (SCENES.length - 1);

export const KeshVideo: React.FC = () => (
  <TransitionSeries>
    {SCENES.map((s, i) => {
      const C = s.c;
      return (
        <React.Fragment key={s.name}>
          {i > 0 ? <TransitionSeries.Transition presentation={i === 2 ? slide({direction: 'from-right'}) : fade()} timing={linearTiming({durationInFrames: T})} /> : null}
          <TransitionSeries.Sequence name={s.name} durationInFrames={s.d}><C /></TransitionSeries.Sequence>
        </React.Fragment>
      );
    })}
  </TransitionSeries>
);
