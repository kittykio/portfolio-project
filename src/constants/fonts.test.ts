jest.mock('next/font/google', () => { const make = jest.fn((options: unknown) => ({ variable: JSON.stringify(options) })); return { Jolly_Lodger: make, Merienda: make, Sometype_Mono: make, Rammetto_One: make, Limelight: make, Sulphur_Point: make, Fascinate: make, Nosifer: make, Waiting_for_the_Sunrise: make }; });
import * as fonts from './fonts';

it('configures every application font for swap rendering', () => {
  expect(Object.keys(fonts)).toHaveLength(10);
  expect(Object.values(fonts).every((configured) => configured.variable.includes('"display":"swap"'))).toBe(true);
});
