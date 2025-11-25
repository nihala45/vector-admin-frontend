import { useQuery } from "@tanstack/react-query";
import { axiosAdmin } from "../../lib/axios";

export function useGetDashboard() {
  return useQuery({
    queryKey: ["getDashboard"],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get("/admin/dashboard");
        // Make sure this returns the data properly
        return response?.data?.data || response?.data;
      } catch (error) {
        console.log("err", error);
        throw error;
      }
    },
  });
}