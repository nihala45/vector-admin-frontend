import { useQuery } from '@tanstack/react-query'
import { axiosAdmin } from '../../lib/axios'

export function useGetVideos() {
  return useQuery({
    queryKey: ['getVideos'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/course/videos/');
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}

export function useGetVideoById(id: string | undefined) {
  return useQuery({
    queryKey: ['getSingleVideos', id],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get(`/api/course/videos/${id}/`);
        return response?.data; 

      } catch (error) {
        console.log('err', error);
        throw error;
      } 
    },
    enabled: !!id, 
  });
}

