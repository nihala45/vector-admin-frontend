import { useGenericMutation } from "../../../components/mutation/useGenericMutation";
import { axiosAdmin } from "../../lib/axios";

export const useBlockOrUnblockUsers = () => {
  return useGenericMutation<any>({
    apiCall: (data) =>
      axiosAdmin.post(
        `/api/admin/users/${data.id}/${data.isBlocked ? "block" : "unblock"}/`
      ),
    onSuccessMessage: "Status changed",
    queryKeyToInvalidate: "getUsers",
  });
};