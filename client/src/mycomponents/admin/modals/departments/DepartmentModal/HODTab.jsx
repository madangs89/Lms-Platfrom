import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { userColumns, userTemplate } from "@/configs/template";
import { useSearchFaculty } from "@/hooks/useSearchFaculty";
import SearchBar from "@/mycomponents/admin/SearchBar";
import SectionCard from "@/mycomponents/admin/SectionCard";
import TableTemplate from "@/mycomponents/admin/TableTemplate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { Avatar } from "radix-ui";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function HODTab({ department, theme }) {
  const { hod, hod_id } = department;
  const queryClient = useQueryClient();
  const [debounceSearch, setDebounceSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const searchFacultyQuery = useSearchFaculty({ searchQuery: debounceSearch });

  useEffect(() => {
    if (searchFacultyQuery.error) {
      toast.error(
        searchFacultyQuery.error.response?.data?.message ||
          searchFacultyQuery.error.message ||
          "Unable to search faculty",
      );
    }
  }, [searchFacultyQuery.error]);

  const facultyData = searchFacultyQuery.data ?? [];

  const updateOrAssignHod = async (payload) => {
    const { departmentId, oldHod_id, newHod_id } = payload;
    const { data } = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/update/hod`,
      { oldHod_id, newHod_id, departmentId },
      { withCredentials: true },
    );
    return data;
  };

  const updateHodMutation = useMutation({
    mutationFn: updateOrAssignHod,
    onSuccess: () => {
      toast.success("HOD updated successfully");
      queryClient.invalidateQueries(["singleDepartment"]);
      queryClient.invalidateQueries(["search-faculty"]);
      queryClient.invalidateQueries(["departments-count"]);
      queryClient.invalidateQueries(["departments-for-table"]);
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["userCounts"]);
      queryClient.invalidateQueries(["available-hod-departments"]);
      queryClient.invalidateQueries(["search_departments"]);
      setSelectedUser(null);
      setDebounceSearch("");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "Failed to update HOD.",
      );
    },
  });

  const handleUpdateHod = () => {
    if (!selectedUser) {
      toast.error("Please select a faculty to assign as HOD");
      return;
    }
    if (selectedUser == hod_id) {
      toast.error("Selected faculty is already the current HOD");
      return;
    }
    updateHodMutation.mutate({
      departmentId: department.id,
      oldHod_id: department.hod_id || false,
      newHod_id: selectedUser,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Current HOD */}
      <SectionCard title="Current Head of Department" theme={theme}>
        {hod_id ? (
          <div
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{
              background: theme.primarySoft,
              border: `1.5px solid ${theme.primary}33`,
            }}
          >
            <Avatar name={hod.name} size={52} color="green" />
            <div className="flex-1">
              <p
                className="text-[15px] font-bold"
                style={{ color: theme.textPrimary }}
              >
                {hod.name}
              </p>
              <p
                className="text-[12px] mt-0.5"
                style={{ color: theme.textSecondary }}
              >
                {hod.email}
              </p>
              <p
                className="text-[12px] mt-0.5"
                style={{ color: theme.textMuted }}
              >
                EMP ID: {hod.employee_id} · {hod.designation}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
              Current HOD
            </Badge>
          </div>
        ) : (
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              background: theme.warning + "12",
              border: `1px solid ${theme.warning}44`,
            }}
          >
            <AlertCircle size={18} color={theme.warning} />
            <p
              className="text-[13px] font-medium"
              style={{ color: theme.textSecondary }}
            >
              No HOD assigned to this department
            </p>
          </div>
        )}
      </SectionCard>

      {/* Search & Assign */}
      <SectionCard title="Search Faculty to Assign as HOD" theme={theme}>
        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: theme.border }}
        >
          <SearchBar
            searching={searchFacultyQuery.isLoading}
            debounceSearch={debounceSearch}
            setDebounceSearch={setDebounceSearch}
            handleClose={() => {
              setSelectedUser(null);
              setDebounceSearch("");
            }}
          />
          <TableTemplate
            columns={userColumns}
            data={facultyData}
            isLoading={searchFacultyQuery.isLoading}
            template={userTemplate}
            isSelectRequired={true}
            selectedId={selectedUser}
            setSelectedId={setSelectedUser}
          />
        </div>

        {updateHodMutation.isError && (
          <Alert variant="destructive" className="mt-3 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-[12px]">
              {updateHodMutation.error?.response?.data?.message ||
                "Failed to assign HOD."}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4">
          <Button
            onClick={handleUpdateHod}
            disabled={
              !selectedUser ||
              selectedUser == hod_id ||
              updateHodMutation.isPending
            }
            className="h-9 text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: theme.primary, color: "#fff", border: "none" }}
          >
            {updateHodMutation.isPending ? <Spinner /> : "Assign as HOD"}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

export default HODTab;
