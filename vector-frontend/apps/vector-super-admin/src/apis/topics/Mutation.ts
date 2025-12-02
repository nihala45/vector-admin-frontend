import { useMutation } from "@tanstack/react-query";
import { useGenericMutation } from "../../../components/mutation/useGenericMutation";
import { axiosAdmin } from "../../lib/axios";





export const useCreatTopic = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return axiosAdmin.post("/api/course/topics/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};


export const useUpdateTopic = (id:any) => {
  return useGenericMutation<any>({
     apiCall: (data) => {
      return axiosAdmin.put(`/api/course/topics/${id}/`, data);
    },
    onSuccessMessage: "Topic Updated Successfully",
    queryKeyToInvalidate: "getTopics",
    // redirectTo: "/courses",
  });
};



export const useDeleteTopicById = (id: any) => {
  return useGenericMutation<any>({
    apiCall: () => axiosAdmin.delete(`/api/course/topics/${id}/`),
    onSuccessMessage: "Topic Deleted Successfully",
    queryKeyToInvalidate: "getTopics",
    // redirectTo: "/course",
  });
};

export const useDeleteTopic = () => {
  return useGenericMutation<any>({
    apiCall: () => axiosAdmin.delete(`/api/course/topics/`),
    onSuccessMessage: "All Topic Deleted Successfully",
    queryKeyToInvalidate: "getTopic",
    // redirectTo: "/course",
  });
};