import { useMutation } from "@tanstack/react-query";
import { useGenericMutation } from "../../../components/mutation/useGenericMutation";
import { axiosAdmin } from "../../lib/axios";

export const useBlockOrUnblockStaff = () => {
  return useGenericMutation<any>({
    apiCall: (data) =>
      axiosAdmin.post(
        `/api/admin/staff/${data.id}/${data.isBlocked ? "block" : "unblock"}/`
      ),
    onSuccessMessage: "Status changed",
    queryKeyToInvalidate: "getUsers",
  });
};


export const useCreateStaff = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return axiosAdmin.post("/api/admin/staff/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};


export const useUpdateStaff = (id:any) => {
  return useGenericMutation<any>({
     apiCall: (data) => {
      return axiosAdmin.put(`/api/admin/staff/${id}`, data);
    },
    onSuccessMessage: "Staff Updated Successfully",
    queryKeyToInvalidate: "getStaff",
    redirectTo: "/staff",
  });
};


export const useDeleteStaff = () => {
  return useGenericMutation<any>({
    apiCall: (id) => axiosAdmin.delete(`/api/admin/staff/${id}`),
    onSuccessMessage: "Staff Deleted Successfully",
    queryKeyToInvalidate: "getStaff",
    redirectTo: "/staff",
  });
};