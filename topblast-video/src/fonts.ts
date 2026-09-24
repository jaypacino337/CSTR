import '@fontsource-variable/archivo/standard.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import {continueRender, delayRender} from 'remotion';

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts');
  const faces = [
    '900 100px "Archivo Variable"',
    '400 20px Inter',
    '600 20px Inter',
    '800 20px Inter',
    '500 20px "JetBrains Mono"',
    '700 20px "JetBrains Mono"',
  ];
  Promise.all(faces.map((f) => document.fonts.load(f)))
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}
