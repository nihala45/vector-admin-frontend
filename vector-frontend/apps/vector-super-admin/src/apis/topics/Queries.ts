import { useQuery } from '@tanstack/react-query'
import { axiosAdmin } from '../../lib/axios'

export function useGetTopics() {
  return useQuery({
    queryKey: ['gettopics'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/course/topics/');
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}

export function useGetTopicById(id: string | undefined) {
  return useQuery({
    queryKey: ['getSingleModule', id],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get(`/api/course/topics/${id}/`);
        return response?.data; 

      } catch (error) {
        console.log('err', error);
        throw error;
      } 
    },
    enabled: !!id, 
  });
}

