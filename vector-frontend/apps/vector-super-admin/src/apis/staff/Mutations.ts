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