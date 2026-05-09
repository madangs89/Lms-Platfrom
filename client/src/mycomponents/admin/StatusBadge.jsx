import { Badge } from "@/components/ui/badge";

function StatusBadge({ active }) {
  return active ? (
    <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
      Active
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-600 border-red-200 hover:bg-red-100">
      Inactive
    </Badge>
  );
}
export default StatusBadge;
