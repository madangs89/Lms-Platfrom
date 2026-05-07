import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useSearchFaculty = ({
  searchQuery,
  enabled = true,
  limit = 10,
}) => {
  return useQuery({
    queryKey: ["search-faculty", searchQuery, limit],

    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/search/faculty-only/${searchQuery}`,
        {
          params: {
            limit,
          },

          withCredentials: true,
        },
      );

      return data.faculty ?? [];
    },

    enabled: enabled && !!searchQuery?.trim(),

    refetchOnWindowFocus: false,

    retry: 2,

    staleTime: 1000 * 60 * 5,
  });
};
