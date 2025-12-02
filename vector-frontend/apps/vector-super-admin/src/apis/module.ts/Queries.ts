import { useQuery } from '@tanstack/react-query'
import { axiosAdmin } from '../../lib/axios'

export function useGetModule() {
  return useQuery({
    queryKey: ['getModule'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/course/modules/');
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}

export function useGetSingleModule(id: string | undefined) {
  return useQuery({
    queryKey: ['getSingleModule', id],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get(`/api/course/modules/${id}/`);
        return response?.data; 

      } catch (error) {
        console.log('err', error);
        throw error;
      } 
    },
    enabled: !!id, 
  });
}

