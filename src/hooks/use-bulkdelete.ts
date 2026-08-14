import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkDeleteUsers } from "../api/bulkApi";

export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userIds: number[]) => bulkDeleteUsers(userIds),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("일괄 삭제가 완료되었습니다.");
    },
  });
};
