import { Skeleton } from "@/components/ui/skeleton";

function OverviewSkeleton({ theme }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border p-5 space-y-4"
          style={{ background: theme.surface, borderColor: theme.border }}
        >
          <Skeleton
            className="h-4 w-24 rounded"
            style={{ background: theme.divider }}
          />
          {[1, 2, 3, 4].map((j) => (
            <div
              key={j}
              className="flex justify-between items-center py-2"
              style={{ borderBottom: `1px solid ${theme.divider}` }}
            >
              <Skeleton
                className="h-3.5 w-20 rounded"
                style={{ background: theme.divider }}
              />
              <Skeleton
                className="h-3.5 w-24 rounded"
                style={{ background: theme.divider }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default OverviewSkeleton;
