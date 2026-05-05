import { TableCell, TableRow } from "@/components/ui/table";

const SkeletonRow = ({ colors, cols }) => (
  <TableRow>
    {Array.from({ length: cols }).map((_, i) => (
      <TableCell key={i}>
        <div
          className="h-4 rounded animate-pulse"
          style={{
            background: colors.border,
            width: i === 0 ? "120px" : "70px",
          }}
        />
      </TableCell>
    ))}
  </TableRow>
);

export default SkeletonRow;
