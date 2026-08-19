import {
  Jolly_Lodger,
  Merienda,
  Sometype_Mono,
  Rammetto_One,
  Limelight,
  Sulphur_Point,
  Fascinate,
  Nosifer,
  Waiting_for_the_Sunrise,
} from 'next/font/google';

// Nav/Heading font
export const heading = Limelight({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

// Regular font default
export const body = Sulphur_Point({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// Regular font bold
export const bodyBold = Sulphur_Point({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-bodyBold',
  display: 'swap',
});

// Logo font
export const flashy = Fascinate({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-flashy',
  display: 'swap',
});

// Section header font
export const drool = Nosifer({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-drool',
  display: 'swap',
});

// MDX fonts
export const awkward = Jolly_Lodger({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-awkward',
  display: 'swap',
});

export const spacey = Sometype_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-spacey',
  display: 'swap',
});

export const playful = Waiting_for_the_Sunrise({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-playful',
  display: 'swap',
});

export const saucy = Merienda({
  weight: '900',
  subsets: ['latin'],
  variable: '--font-saucy',
  display: 'swap',
});

export const loud = Rammetto_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-loud',
  display: 'swap',
});
