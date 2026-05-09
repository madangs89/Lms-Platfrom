import Header from "@/mycomponents/admin/Header";
import MetricCard from "@/mycomponents/admin/MetricCard";
import AddBranch from "@/mycomponents/admin/modals/branches/AddBranch";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CirclePile, House, ShieldBan, Split } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AdminBranches = () => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const [open, setOpen] = useState(false);

  const fetchBranches = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/branch/branches-counts-total-active-inactive-specializations`,
      {
        withCredentials: true,
      },
    );
    return data;
  };

  const branchQuery = useQuery({
    queryKey: ["branches-counts"],
    queryFn: fetchBranches,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 3000,
    staleTime: 5 * 60 * 1000,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (branchQuery.error) {
      toast.error(
        branchQuery.error?.response?.data?.message ||
          branchQuery.error.message ||
          "Failed to fetch branches data",
      );
    }
  }, [branchQuery.error]);

  return (
    <div className="w-full flex flex-col gap-4 h-screen overflow-y-auto ">
      {/* ── Header ── */}

      <Header
        colors={colors}
        title="Branches"
        bigScreenButtonText="Add Branch"
        smallScreenButtonText="Add"
        onClick={() => setOpen(true)}
      />

      {/* ── Metric Cards — always 4 in a row, shrink on small ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          title="Total Branches"
          value={branchQuery?.data?.totalBranches || "0"}
          Icon={Split}
          loading={branchQuery.isLoading}
        />
        <MetricCard
          title="Active Branches"
          value={branchQuery?.data?.activeBranches || "0"}
          Icon={House}
          loading={branchQuery.isLoading}
        />
        <MetricCard
          title="Inactive Branches"
          value={branchQuery?.data?.inactiveBranches || "0"}
          Icon={ShieldBan}
          loading={branchQuery.isLoading}
          isRed={true}
        />
        <MetricCard
          title="Total Specializations"
          value={branchQuery?.data?.totalSpecializations || "0"}
          Icon={CirclePile}
          loading={branchQuery.isLoading}
        />
      </div>

      <AddBranch open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AdminBranches;
