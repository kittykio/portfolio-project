/**
 * Generates an array of numbers within a specified range, similar to Python's range().
 *
 * It supports two calling patterns:
 * 1. getRange(end: number, step?: number) - Starts at 0.
 * 2. getRange(start: number, end: number, step?: number) - Starts at `start`.
 */
export function getRange(start: number, end?: number, step: number = 1): number[] {
  let output: number[] = [];

  // We need to use local variables to safely reassign values
  let currentStart = start;
  let currentEnd: number;

  // If the second argument (which is the potential 'end' value) is missing,
  // the first argument ('start') is reassigned to be the 'end', and 'start' becomes 0.
  if (typeof end === 'undefined') {
    currentEnd = currentStart;
    currentStart = 0;
  } else {
    currentEnd = end;
  }

  // Input Validation (Add simple protection against infinite loops)
  if (
    step === 0 ||
    (step > 0 && currentStart >= currentEnd) ||
    (step < 0 && currentStart <= currentEnd)
  ) {
    // If step is 0 or direction is wrong (e.g., start=10, end=5, step=1)
    return [];
  }

  // Loop logic handles positive and negative steps
  if (step > 0) {
    for (let i = currentStart; i < currentEnd; i += step) {
      output.push(i);
    }
  } else {
    for (let i = currentStart; i > currentEnd; i += step) {
      output.push(i);
    }
  }

  return output;
}

export default getRange;
