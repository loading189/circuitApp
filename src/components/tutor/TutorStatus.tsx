export const TutorStatus = ({ isLoading }: { isLoading: boolean }): JSX.Element => {
  if (!isLoading) {
    return <p className="text-[11px] text-token-secondary">Ask about what you’re building, what changed, or what to probe next.</p>;
  }

  return (
    <div className="flex items-center gap-2 text-xs text-cyan-200">
      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
      analyzing circuit context…
    </div>
  );
};
