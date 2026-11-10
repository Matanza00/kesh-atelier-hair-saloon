import React from 'react';
import {Composition, Still} from 'remotion';
import {KeshVideo, TOTAL} from './Video';
import {End} from './Scenes';
import {Cover} from './Cover';

export const Root: React.FC = () => (
  <>
    <Composition id="KeshLinkedIn" component={KeshVideo} durationInFrames={TOTAL} fps={30} width={1080} height={1350} />
    <Still id="Cover" component={Cover} width={1080} height={1350} />
  </>
);
