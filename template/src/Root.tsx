import React from 'react';
import {Composition, staticFile} from 'remotion';
import {Video, DURATION, fps} from './Video';
import {W, H} from './theme';

export const FontFaces: React.FC = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @font-face { font-family: 'Inter'; font-weight: 400 800; font-display: swap;
      src: url(${staticFile('fonts/Inter.woff2')}) format('woff2'); }
    @font-face { font-family: 'JetBrains Mono'; font-weight: 400 700; font-display: swap;
      src: url(${staticFile('fonts/JetBrainsMono.woff2')}) format('woff2'); }
    `,
    }}
  />
);

export const RemotionRoot: React.FC = () => (
  <>
    <FontFaces />
    <Composition id="Video" component={Video} durationInFrames={DURATION} fps={fps} width={W} height={H} />
  </>
);
