import { BranchTableColumns, BranchTemplate } from "@/configs/template";
import { useDepartments } from "@/hooks/useDepartments";
import Header from "@/mycomponents/admin/Header";
import MetricCard from "@/mycomponents/admin/MetricCard";
import AddBranch from "@/mycomponents/admin/modals/branches/AddBranch";
import SearchBar from "@/mycomponents/admin/SearchBar";
import SelectHandler from "@/mycomponents/admin/SelectHandler";
import TableTemplate from "@/mycomponents/admin/TableTemplate";
import PaginationHandler from "@/mycomponents/shared/PaginationHandler";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CirclePile, House, ShieldBan, Split } from "lucide-react";
import { Select } from "radix-ui";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AdminBranches = () => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = parseInt(import.meta.env.VITE_LIMIT) || 10;
  const [activeFilter, setActiveFilter] = useState("active");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const [debounceSearch, setDebounceSearch] = useState("");
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

  const fetchBranchesForTable = async (payload) => {
    const { page, limit, active, department } = payload;
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/branch/branches-with-name-code-department-specialization-count-status/${page}/${limit}/${active}/${department}`,
      {
        withCredentials: true,
      },
    );
    return data;
  };

  const branchesQuery = useQuery({
    queryKey: ["branches-table", page, limit, activeFilter, departmentFilter],
    queryFn: () =>
      fetchBranchesForTable({
        page,
        limit,
        active: activeFilter,
        department: departmentFilter,
      }),
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 3000,
    staleTime: 5 * 60 * 1000,
    refetchOnReconnect: true,
  });
  useEffect(() => {
    if (branchesQuery.error) {
      toast.error(
        branchesQuery.error?.response?.data?.message ||
          branchesQuery.error.message ||
          "Failed to fetch branches data",
      );
    }
  }, [branchesQuery.error]);

  const searchBranch = async (payload) => {
    const { query } = payload;
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/branch/search/branch/${query}`,
      {
        withCredentials: true,
      },
    );
    return data;
  };

  const departments = useDepartments({});

  useEffect(() => {
    if (departments.error) {
      toast.error(
        departments.error?.response?.data?.message ||
          departments.error.message ||
          "Failed to fetch departments",
      );
    }
  }, [departments.error]);

  const branchSearchQuery = useQuery({
    queryKey: ["branch-search", debounceSearch],
    queryFn: () => searchBranch({ query: debounceSearch }),
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 3000,
    staleTime: 5 * 60 * 1000,
    refetchOnReconnect: true,
    enabled: !!debounceSearch?.trim(),
  });
  useEffect(() => {
    if (branchSearchQuery.error) {
      toast.error(
        branchSearchQuery.error?.response?.data?.message ||
          branchSearchQuery.error.message ||
          "Failed to fetch branches data",
      );
    }
  }, [branchSearchQuery.error]);

  const branches = debounceSearch?.trim()
    ? branchSearchQuery.data?.branches || []
    : branchesQuery.data?.branches || [];

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

      <div
        className="rounded-lg border  flex-1 overflow-y-auto min-h-0 "
        style={{ borderColor: colors.border, background: colors.card }}
      >
        <div className="rounded-lg border w-full   ">
          <div className="w-full py-2 flex justify-between items-center flex-col md:flex-row gap-2 px-3">
            <SearchBar
              debounceSearch={debounceSearch}
              setDebounceSearch={setDebounceSearch}
              searching={branchSearchQuery.isLoading}
            />

            <div className="flex gap-2 justify-center items-center">
              <SelectHandler
                setActiveFilter={setDepartmentFilter}
                setPage={setPage}
                label="Filter by Department"
                data={
                  departments.data
                    ? [{ id: "all", name: "All" }, ...departments.data.map((d) => ({ id: d.id, name: d.name }))]
                    : []
                }
              />
              <SelectHandler
                setActiveFilter={setActiveFilter}
                setPage={setPage}
                label="Filter by Status"
                data={[
                  { id: "active", name: "Active" },
                  { id: "inactive", name: "Inactive" },
                ]}
              />
            </div>
          </div>
          <TableTemplate
            colors={colors}
            columns={BranchTableColumns}
            data={branches}
            template={BranchTemplate}
            isLoading={branchesQuery.isLoading}
            isActionRequired={true}
            // setModalOpen={setModalOpen}
            // setCurrentId={setCurrentSelectedId}
          />
        </div>
        <PaginationHandler
          page={page}
          isSearchMode={!!debounceSearch?.trim()}
          setPage={setPage}
          totalPages={parseInt(branchesQuery?.data?.totalCount / limit) || 1}
          total={branchesQuery.data?.totalCount || 0}
          LIMIT={limit}
          loading={branchQuery.isLoading}
          searching={branchSearchQuery.isLoading}
          searchResults={branchSearchQuery.data}
          debounceSearch={debounceSearch}
        />
      </div>

      <AddBranch open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AdminBranches;
