import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, TOTAL_SEC, W} from './lib';
import {Video} from './Video';
import {Thumbnail} from './Thumbnail';

export const Root: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={Math.round(TOTAL_SEC * FPS)} fps={FPS} width={W} height={H} />
    {/* YouTube thumbnail: npx remotion still src/index.ts Thumbnail out/thumbnail.png */}
    <Composition id="Thumbnail" component={Thumbnail} durationInFrames={1} fps={FPS} width={1280} height={720} />
  </>
);
