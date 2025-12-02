import { useMutation } from "@tanstack/react-query";
import { useGenericMutation } from "../../../components/mutation/useGenericMutation";
import { axiosAdmin } from "../../lib/axios";





export const useCreatePdf = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return axiosAdmin.post("/api/course/documents/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};


export const useUpdatePdf = (id:any) => {
  return useGenericMutation<any>({
     apiCall: (data) => {
      return axiosAdmin.put(`/api/course/documents/${id}/`, data);
    },
    onSuccessMessage: "Pdf Updated Successfully",
    queryKeyToInvalidate: "getPdfs",
    // redirectTo: "/courses",
  });
};



export const useDeletePdfById = (id: any) => {
  return useGenericMutation<any>({
    apiCall: () => axiosAdmin.delete(`/api/course/documents/${id}/`),
    onSuccessMessage: "Pdf Deleted Successfully",
    queryKeyToInvalidate: "getPdfs",
    // redirectTo: "/course",
  });
};

export const useDeletePdf = () => {
  return useGenericMutation<any>({
    apiCall: () => axiosAdmin.delete(`/api/course/documents/`),
    onSuccessMessage: "All pdf Deleted Successfully",
    queryKeyToInvalidate: "getPdfs",
    // redirectTo: "/course",
  });
};