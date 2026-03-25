export const summarizeRecentChanges = (changes: string[]): string => {
  if (!changes.length) {
    return 'No recent edits. Place, move, or wire a component to build timeline context.';
  }

  return changes.slice(-3).join(' · ');
};
