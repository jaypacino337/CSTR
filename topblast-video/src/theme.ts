import {Easing, interpolate} from 'remotion';

export const C = {
  bg: '#050506',
  ink: '#0B0B0D',
  white: '#F7F4EE',
  offWhite: '#F2EDE4',
  dim: 'rgba(247,244,238,0.55)',
  faint: 'rgba(247,244,238,0.12)',
  orange: '#FF6A00',
  orangeHot: '#FF8A1F',
  red: '#FF2D14',
  yellow: '#FFC21A',
  blue: '#2C7BFF',
  blueHot: '#5EA2FF',
  green: '#19C37D',
  greenHot: '#4BE39E',
};

export const DISPLAY = '"Archivo Variable", "Archivo", sans-serif';
export const UI = 'Inter, sans-serif';
export const MONO = '"JetBrains Mono", monospace';

export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const quintInOut = Easing.bezier(0.83, 0, 0.17, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);
export const expoIn = Easing.bezier(0.7, 0, 0.84, 0);

/** 0→1 progress over [start, start+dur], clamped and eased. */
export const prog = (
  frame: number,
  start: number,
  dur: number,
  easing: (t: number) => number = expoOut,
) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Piecewise keyframe interpolation with per-segment easing. */
export const keys = (
  frame: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = inOut,
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
