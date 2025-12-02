import { useQuery } from '@tanstack/react-query'
import { axiosAdmin } from '../../lib/axios'

export function useGetPdfs() {
  return useQuery({
    queryKey: ['getpdfs'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/course/documents/');
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}

export function useGetPdfById(id: string | undefined) {
  return useQuery({
    queryKey: ['getSinglePdf', id],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get(`/api/course/documents/${id}/`);
        return response?.data; 

      } catch (error) {
        console.log('err', error);
        throw error;
      } 
    },
    enabled: !!id, 
  });
}

