export const voltsBetween = (a: number | undefined, b: number | undefined): number => {
  return (a ?? 0) - (b ?? 0);
};
