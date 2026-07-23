// Generic loading skeleton shown via loading.tsx while a route segment's
// server data is fetching. Deliberately content-agnostic (a title bar plus
// a few blocks) rather than page-specific — cheap to add everywhere,
// avoids a blank flash on navigation.
export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-7 w-48 rounded bg-charcoal/10" />
      <div className="h-24 rounded-xl bg-charcoal/5" />
      <div className="h-24 rounded-xl bg-charcoal/5" />
      <div className="h-24 rounded-xl bg-charcoal/5" />
    </div>
  );
}
