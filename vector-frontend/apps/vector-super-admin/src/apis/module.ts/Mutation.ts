import { useMutation } from "@tanstack/react-query";
import { useGenericMutation } from "../../../components/mutation/useGenericMutation";
import { axiosAdmin } from "../../lib/axios";





export const useCreatModule = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return axiosAdmin.post("/api/course/modules/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};


export const useUpdateModule = (id:any) => {
  return useGenericMutation<any>({
     apiCall: (data) => {
      return axiosAdmin.put(`/api/course/modules/${id}/`, data);
    },
    onSuccessMessage: "Module Updated Successfully",
    queryKeyToInvalidate: "getModules",
    // redirectTo: "/courses",
  });
};



export const useDeleteModuleById = (id: any) => {
  return useGenericMutation<any>({
    apiCall: () => axiosAdmin.delete(`/api/course/modules/${id}/`),
    onSuccessMessage: "Module Deleted Successfully",
    queryKeyToInvalidate: "getModules",
    // redirectTo: "/course",
  });
};

export const useDeleteModule = () => {
  return useGenericMutation<any>({
    apiCall: () => axiosAdmin.delete(`/api/course/modules/`),
    onSuccessMessage: "All modules Deleted Successfully",
    queryKeyToInvalidate: "getModules",
    // redirectTo: "/course",
  });
};