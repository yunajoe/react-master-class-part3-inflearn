import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserApi, type User } from "../api/mockApi2";
import { userKeys } from "../queries/queryKeys";

export default function UserEditor({ id }: { id: number }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<User, Error, User>({
    mutationFn: (updatedUser) => updateUserApi(updatedUser),

    onSuccess: (data, variables) => {
      /**
       * 엔진은 'users'로 시작하는 모든 캐시를 찾아 즉시 'Stale' 딱지를 붙입니다.
       * 화면에서 이 데이터를 쓰고 있는 모든 컴포넌트에게 재요청 신호를 보냅니다.
       */
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });

      console.log(`✨ ${variables.name}님 정보 갱신 프로세스 진입`);
    },
  });

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <h3>수정 제어실</h3>
      <button
        disabled={isPending}
        onClick={() =>
          mutate({ id, name: "New Senior " + Math.floor(Math.random() * 100) })
        }
      >
        {isPending ? "서버 통신 중..." : "이름 랜덤 수정 및 무효화"}
      </button>
    </div>
  );
}
