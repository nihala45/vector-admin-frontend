import { useQuery } from '@tanstack/react-query'
import { axiosAdmin } from '../../lib/axios'

export function useGetUsers() {
  return useQuery({
    queryKey: ['getUsers'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/admin/users/');

        // 🔥 Always return valid data structure
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}