import React from 'react';
import {Composition, staticFile} from 'remotion';
import {RpgVideo, DURATION, fps} from './Video';

export const FontFaces: React.FC = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @font-face { font-family: 'Press Start 2P'; font-display: swap;
      src: url(${staticFile('fonts/PS2P.ttf')}) format('truetype'); }
    `,
    }}
  />
);

export const RemotionRoot: React.FC = () => (
  <>
    <FontFaces />
    <Composition
      id="RpgVideo"
      component={RpgVideo}
      durationInFrames={DURATION}
      fps={fps}
      width={1080}
      height={1920}
    />
  </>
);
