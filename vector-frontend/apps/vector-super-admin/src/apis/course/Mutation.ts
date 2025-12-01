import { useMutation } from "@tanstack/react-query";
import { useGenericMutation } from "../../../components/mutation/useGenericMutation";
import { axiosAdmin } from "../../lib/axios";





export const useCreateCourse = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return axiosAdmin.post("/api/course/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};


export const useUpdateCourse = (id:any) => {
  return useGenericMutation<any>({
     apiCall: (data) => {
      return axiosAdmin.put(`/api/course/${id}`, data);
    },
    onSuccessMessage: "Course Updated Successfully",
    queryKeyToInvalidate: "getCourses",
    redirectTo: "/course",
  });
};

export const useDeleteCourseById = (id: any) => {
  return useGenericMutation<any>({
    apiCall: () => axiosAdmin.delete(`/api/course/${id}/`),
    onSuccessMessage: "Course Deleted Successfully",
    queryKeyToInvalidate: "getCourses",
    redirectTo: "/course",
  });
};

export const useDeleteAllCourses = () => {
  return useGenericMutation<any>({
    apiCall: () => axiosAdmin.delete(`/api/course/`),
    onSuccessMessage: "All Courses Deleted Successfully",
    queryKeyToInvalidate: "getCourses",
    redirectTo: "/course",
  });
};