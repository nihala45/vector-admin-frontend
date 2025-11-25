import { axiosAdmin } from "../../lib/axios";
import { useQuery } from "@tanstack/react-query";


export function useGetMe() {
    return useQuery({
      queryKey: ['getme'],
      queryFn: async() => {
        try {
          const response = await axiosAdmin.get("user/me");
          console.log(response?.data?.data);
          return response?.data?.data;
        } catch (error) {
          console.log('err', error);
          throw error;
        }
      }
    });
  }

