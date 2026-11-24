// Renders a few still frames for checking: node stills.mjs <outDir> <sec> <sec> ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const [outDir, ...secs] = process.argv.slice(2);
const shell = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: process.env.COMP || 'Facebook', browserExecutable: shell});
for (const s of secs) {
  const frame = Math.round(parseFloat(s) * composition.fps);
  const output = path.join(outDir, `t${String(s).padStart(6, '0')}.png`);
  await renderStill({serveUrl, composition, frame, output, browserExecutable: shell, scale: 0.5});
  console.log('ok', s, output);
}
