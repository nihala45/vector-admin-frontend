import { useQuery } from '@tanstack/react-query'
import { axiosAdmin } from '../../lib/axios'

export function useGetCourse() {
  return useQuery({
    queryKey: ['getCourses'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/course/');
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}

export function useGetSingleCourse(id: string | undefined) {
  return useQuery({
    queryKey: ['getSingleCourse', id],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get(`/api/course/${id}/`);
        return response?.data; 

      } catch (error) {
        console.log('err', error);
        throw error;
      } 
    },
    enabled: !!id, 
  });
}

export function useGetCourseBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['getCourseBySlug', slug],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get(`/api/course/${slug}/`);
        return response?.data;
      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
    enabled: !!slug,
  });
}