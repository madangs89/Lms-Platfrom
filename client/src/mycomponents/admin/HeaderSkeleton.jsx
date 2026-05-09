import { Skeleton } from "@/components/ui/skeleton";

function HeaderSkeleton({ theme }) {
  return (
    <div
      className="px-7 pt-6 pb-0"
      style={{
        background: theme.surface,
        borderBottom: `1px solid ${theme.divider}`,
      }}
    >
      <div className="flex items-center gap-4 mb-5">
        <Skeleton
          className="w-14 h-14 rounded-2xl"
          style={{ background: theme.divider }}
        />
        <div className="flex-1 space-y-2">
          <Skeleton
            className="h-6 w-48 rounded-md"
            style={{ background: theme.divider }}
          />
          <Skeleton
            className="h-4 w-72 rounded-md"
            style={{ background: theme.divider }}
          />
        </div>
      </div>
      <div className="flex gap-2 pb-0">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-10 w-28 rounded-none rounded-t-md"
            style={{ background: theme.divider }}
          />
        ))}
      </div>
    </div>
  );
}

export default HeaderSkeleton;
