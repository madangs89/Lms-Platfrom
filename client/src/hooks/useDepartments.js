import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useDepartments = ({ enabled = true }) => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/department/active-departments`,
        { withCredentials: true },
      );

      return data.departments || [];
    },
    retry: 3,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    enabled: enabled,
  });
};
