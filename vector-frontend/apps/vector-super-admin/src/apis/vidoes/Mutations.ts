import { useMutation } from "@tanstack/react-query";
import { useGenericMutation } from "../../../components/mutation/useGenericMutation";
import { axiosAdmin } from "../../lib/axios";





export const useCreatVideo = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return axiosAdmin.post("/api/course/videos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};


export const useUpdateVideo = (id:any) => {
  return useGenericMutation<any>({
     apiCall: (data) => {
      return axiosAdmin.put(`/api/course/videos/${id}/`, data);
    },
    onSuccessMessage: "Video Updated Successfully",
    queryKeyToInvalidate: "getTopics",
    // redirectTo: "/courses",
  });
};



export const useDeleteVideoById = (id: any) => {
  return useGenericMutation<any>({
    apiCall: () => axiosAdmin.delete(`/api/course/videos/${id}/`),
    onSuccessMessage: "Video Deleted Successfully",
    queryKeyToInvalidate: "getVideos",
    // redirectTo: "/course",
  });
};

export const useDeleteVideo = () => {
  return useGenericMutation<any>({
    apiCall: () => axiosAdmin.delete(`/api/course/videos/`),
    onSuccessMessage: "All Video Deleted Successfully",
    queryKeyToInvalidate: "getVideos",
    // redirectTo: "/course",
  });
};