import { useQuery } from '@tanstack/react-query'
import { axiosAdmin } from '../../lib/axios'

export function useGetStaff() {
  return useQuery({
    queryKey: ['getStaff'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/admin/staff/');

        // 🔥 Always return valid data structure
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}