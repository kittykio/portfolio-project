import getRange from '@/utils/getRange';

describe('getRange', () => {
  it.each([
    [5, undefined, undefined, [0, 1, 2, 3, 4]],
    [2, 8, 2, [2, 4, 6]],
    [5, 0, -2, [5, 3, 1]],
  ])('builds the expected range', (start, end, step, expected) => {
    expect(getRange(start, end, step)).toEqual(expected);
  });

  it.each([[1, 5, 0], [5, 1, 1], [1, 5, -1]])(
    'returns an empty range for an invalid direction or step',
    (start, end, step) => expect(getRange(start, end, step)).toEqual([]),
  );
});
