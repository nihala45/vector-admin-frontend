import { axiosAdmin } from "../../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../store/AuthStore";




export function useGetMe(){
  const admin = useAuthStore(state => state.admin);
  const userId = admin?.user_id;

  return useQuery({
    queryKey: ["getMe", userId],
    queryFn: async () => {  
      const response = await axiosAdmin.get(`/api/admin/me/${userId}/`);
      return response.data;
    },
    enabled: !!userId,
  });
}