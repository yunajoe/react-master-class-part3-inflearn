import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTodoApi, todoKeys, type Todo } from "../api/mockApi2";

function TodoEditor() {
  const queryClient = useQueryClient();
  /**
   * useMutation<TData, TError, TVariables, TContext>
   * 1. TData: 성공 시 서버 응답 타입 (Todo)
   * 2. TError: 에러 발생 시 타입 (Error)
   * 3. TVariables: mutate에 넘길 데이터 타입 (Todo)
   * 4. TContext: 백업 데이터의 구조 ({ previousTodos: Todo[] | undefined })
   */

  const { mutate } = useMutation<
    Todo,
    Error,
    Todo,
    { previousTodos: Todo[] | undefined }
  >({
    mutationFn: (newTodo) => postTodoApi(newTodo),
    // [1단계] 방아쇠를 당기자마자 즉시 실행: "백업 및 선제 UI 타격"
    onMutate: async (newTodo: Todo) => {
      // 진행 중인 쿼리 취소: 이전의 fetch 응답이 현재의 낙관적 UI를 덮어쓰지 않게 방어
      await queryClient.cancelQueries({ queryKey: todoKeys.all });

      // [스냅샷 촬영]: 현재 캐시에 저장된 할 일 목록을 백업
      const previousTodos = queryClient.getQueryData<Todo[]>(todoKeys.all);
      // [선제 타격]: 서버 응답 기다리지 않고 캐시에 가짜 데이터를 즉시 주입 (낙관적 업데이트)
      queryClient.setQueryData<Todo[]>(todoKeys.all, (old) => [
        ...(old || []),
        newTodo,
      ]);

      // [TContext 반환]: 찍어둔 스냅샷을 반환하면 onError의 context 인자로 배달됨
      return { previousTodos };
    },
    // 서버 요청 실패 시 실행: "비상 대책(Rollback)"
    onError: (err, newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.all, context.previousTodos);
      }
      alert(`⚠️ 복구 알림: ${err.message}`);
    },
    // 성공/실패 여부와 상관없이 실행: "최종 정합성 맞추기"
    onSettled: () => {
      //  서버와 1%의 오차도 없도록 무효화 실행 (실제 ID 등으로 갱신)
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
  return (
    <div
      style={{
        padding: "1.5rem",
        border: "2px solid #333",
        borderRadius: "12px",
      }}
    >
      <button onClick={() => mutate({ id: Date.now(), text: "낙관적 할 일" })}>
        할 일 추가 (0초 로딩 경험)
      </button>
    </div>
  );
}

export default TodoEditor;
