/**
 * Canvas/WebGL mirror of the CSS palette in `src/styles/_variables.scss`.
 * CSS variables are the theme source of truth; this object exists because
 * canvas and ImageResponse need resolved color strings.
 */
export const colorPalette = {
  black: '#000000',
  white: '#ffffff',
  gray100: '#e6e6e6',
  gray300: '#bababa',
  gray500: '#8b8b8b',
  gray700: '#505050',
  gray900: '#292929',
  cocoa700: '#2d2926',
  cocoa900: '#2c2522',
  flame300: '#eb7858',
  flame500: '#cb4625',
  flame700: '#8c280d',
  flame900: '#591806',
  lemon: '#e8ff38',
  labSky: '#87ceeb',
  rainbowRed: '#ff6b6b',
  rainbowOrange: '#ffad69',
  rainbowYellow: '#ffe66d',
  rainbowGreen: '#7bd389',
  rainbowBlue: '#70c1ff',
  rainbowViolet: '#b388eb',
} as const;
