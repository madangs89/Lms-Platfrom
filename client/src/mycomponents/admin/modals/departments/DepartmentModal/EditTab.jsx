import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import SectionCard from "@/mycomponents/admin/SectionCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlertCircle } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";

function EditTab({ department, theme }) {
  const [name, setName] = useState(department?.name || "");
  const [code, setCode] = useState(department?.code || "");
  const [active, setActive] = useState(department?.is_active);
  const [initialData, setInitialData] = useState({
    name: department?.name,
    code: department?.code,
    active: department?.is_active,
  });
  const queryClient = useQueryClient();

  const updateDepartment = async (payload) => {
    const { deptName, deptCode, deptIs_active } = payload;
    const { data } = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/update/info/${department.id}`,
      { name: deptName, code: deptCode, is_active: deptIs_active },
      { withCredentials: true },
    );
    return data.department;
  };

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      toast.success("Department updated successfully");
      queryClient.invalidateQueries(["singleDepartment"]);
      queryClient.invalidateQueries(["search-faculty"]);
      queryClient.invalidateQueries(["departments-count"]);
      queryClient.invalidateQueries(["departments-for-table"]);
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["userCounts"]);
      queryClient.invalidateQueries(["available-hod-departments"]);
      queryClient.invalidateQueries(["search_departments"]);
      setInitialData({ name, code, active });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to update department. Try again.",
      );
    },
  });

  const hasChanges =
    name !== initialData.name ||
    code !== initialData.code ||
    active !== initialData.active;

  const handleSave = () => {
    if (!name.trim() || !code.trim()) {
      toast.error("Department name and code cannot be empty");
      return;
    }
    if (!hasChanges) {
      toast.error("No changes detected");
      return;
    }
    updateDepartmentMutation.mutate({
      deptName: name,
      deptCode: code,
      deptIs_active: active,
    });
  };

  return (
    <div className="max-w-lg">
      <SectionCard title="Edit Department Details" theme={theme}>
        <div className="flex flex-col gap-5">
          {[
            { label: "Department Name", value: name, set: setName },
            { label: "Department Code", value: code, set: setCode },
          ].map(({ label, value, set }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <Label
                className="text-[13px] font-semibold"
                style={{ color: theme.textPrimary }}
              >
                {label} <span style={{ color: theme.danger }}>*</span>
              </Label>
              <Input
                value={value}
                onChange={(e) => set(e.target.value)}
                className="h-9 text-sm focus-visible:ring-1 focus-visible:ring-offset-0"
                style={{
                  background: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.inputText,
                }}
              />
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <Label
              className="text-[13px] font-semibold"
              style={{ color: theme.textPrimary }}
            >
              Status
            </Label>
            <div className="flex gap-2">
              {[true, false].map((v) => {
                const selected = active === v;
                return (
                  <button
                    key={String(v)}
                    onClick={() => setActive(v)}
                    className="px-5 py-2 rounded-lg text-[13px] font-bold transition-all"
                    style={{
                      border: `2px solid ${selected ? theme.primary : theme.border}`,
                      background: selected ? theme.primarySoft : "transparent",
                      color: selected ? theme.primary : theme.textMuted,
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {v ? "Active" : "Inactive"}
                  </button>
                );
              })}
            </div>
          </div>

          {updateDepartmentMutation.isError && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-[12px]">
                {updateDepartmentMutation.error?.response?.data?.message ||
                  "Failed to save changes."}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSave}
            disabled={updateDepartmentMutation.isPending || !hasChanges}
            className="h-9 text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: theme.primary, color: "#fff", border: "none" }}
          >
            {updateDepartmentMutation.isPending ? <Spinner /> : "Save Changes"}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

export default EditTab;
