### 69. 쿼리 무효화(Query Invalidation) 완벽 정리

1. 💡 캐시 무효화란? (선언적 프로그래밍의 정수)

- 개발자가 데이터를 수동으로 고치는(명령형) 대신, "이 키(Query Key)를 가진 데이터는 상했으니, 엔진이 알아서 버리고 서버에서 새로 가져와라"라고 선언하는 방식

- 장점:

```
정밀 타격: 페이지 전체가 아닌, 해당 queryKey를 공유하는 데이터만 새로고침.
연속성 유지: 브라우저 새로고침이 없어 스크롤 위치나 폼 입력 상태가 유지됨.
백그라운드 동기화: 백그라운드에서 조용히 새 데이터를 가져와 화면 깜빡임 없이 부드럽게 교체(Seamless Update)됨.

```

2. ⚙️ invalidateQueries의 내부 동작 4단계

- 단 한 줄의 명령(queryClient.invalidateQueries())이 실행될 때 엔진 내부에서 일어나는 과정

```
1.  Mark as Stale (낡음 표시): 지정된 queryKey와 일치하는 메모리 캐시들에 '상함(Stale)' 딱지를 붙임.
2.  Identify Observers (관찰자 식별): 현재 화면에서 해당 데이터를 구독 중인 컴포넌트를 찾아냄.
3.  Background Refetch (백그라운드 재요청): 사용 중인 데이터를 위해 엔진이 자동으로 서버에 GET 요청(QueryFn)을 다시 보냄.
4. Seamless Update (매끄러운 업데이트): 응답이 도착하면 컴포넌트에 새로운 데이터를 밀어 넣어 화면을 깜빡임 없이 갱신.

```

3. 🛠️ 단계별 구현 가이드

- 실무 환경에서는 모듈 간의 명확한 데이터 공유가 필수적입니다. 인터페이스와 키 공장을 체계적으로 설계

```javascript
// 유저 정보를 위한 표준 규격
export interface User {
  id: number;
  name: string;
}

// 58강에서 강조한 Key Factory 패턴: 무효화의 범위를 결정하는 설계도입니다.
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
};

// 유저 수정 API (실제 통신처럼 0.5초의 지연을 줍니다)
export const updateUserApi = async (updatedUser: User): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`📡 [Network] 서버 데이터 수정 완료: ${updatedUser.name}`);
      resolve(updatedUser);
    }, 500);
  });
};

// 유저 조회 API (무효화 직후 엔진이 자동으로 호출할 함수입니다)
export const fetchUserApi = async (id: number): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "시니어 개발자 (수정 전)" });
    }, 300);
  });
};


```

### 70. 낙관적 업데이트(Optimistic Update)완벽 정리

1. 낙관적 업데이트란? (성공을 가정한 선제 UI 업데이트)

- 서버 응답을 기다리지 않고 성공할 것이라 "낙관적"으로 가정하여, 요청 즉시 UI를 먼저 변경하는 UX 전략 (예: 인스타그램 '좋아요' 하트 버튼)

```
0초 로딩 경험: 네트워크 지연(Latency)을 가려주어 사용자에게 압도적인 속도감을 제공.
서비스 만족도 향상: 1초 미만의 대기 시간 제거만으로 앱이 가볍고 빠르다는 인식을 형성.
안전한 롤백 보장: 실패 시 TContext 스냅샷을 활용해 이전 상태로 완벽 복구.
```

2. 아키텍처 원칙: TContext와 롤백(Rollback)

- 단순히 화면만 먼저 바꾸는 것이 아닌, 실패 시나리오 대응 구조가 핵심

```
1. cancelQueries (경합 방지): 진행 중인 쿼리를 취소하여 이전 fetch 응답이 낙관적 UI를 덮어쓰지 않게 방어.
2. TContext (타임머신용 스냅샷): onMutate 단계에서 현재 캐시 데이터를 백업해 둔 스냅샷.
3. Rollback (복구): 서버 요청 실패(onError) 시 TContext 스냅샷으로 캐시를 이전 상태로 복구.
4. Final Sync (최종 정화): 성공/실패 여부와 관계없이 onSettled에서 invalidateQueries를 실행하여 서버 데이터와 최종 동기화.

```

3. 단계별 구현 가이드

- useMutation의 4번째 제네릭인 TContext와 onMutate -> onError -> onSettled 사이클을 체계적으로 설계

```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postTodoApi, todoKeys } from '../api/mockApi';
import type { Todo } from '../api/mockApi';

export default function TodoEditor() {
  const queryClient = useQueryClient();

  // useMutation<TData, TError, TVariables, TContext>
  const { mutate } = useMutation<Todo, Error, Todo, { previousTodos: Todo[] | undefined }>({
    mutationFn: (newTodo) => postTodoApi(newTodo),

    // [1단계] 즉시 실행: 진행 중인 쿼리 취소 -> 백업(TContext) -> 선제 UI 업데이트
    onMutate: async (newTodo: Todo) => {
      await queryClient.cancelQueries({ queryKey: todoKeys.all });

      const previousTodos = queryClient.getQueryData<Todo[]>(todoKeys.all);
      queryClient.setQueryData<Todo[]>(todoKeys.all, (old) => [...(old || []), newTodo]);

      return { previousTodos }; // onError의 context로 전달됨
    },

    // [2단계] 실패 시 실행: 스냅샷(context) 기반 복구
    onError: (err, newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(todoKeys.all, context.previousTodos);
      }
      alert(`⚠️ 복구 알림: ${err.message}`);
    },

    // [3단계] 최종 실행: 서버 데이터와 완전한 정합성 보장
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    }
  });

  return (
    <div style={{ padding: '1.5rem', border: '2px solid #333', borderRadius: '12px' }}>
      <button onClick={() => mutate({ id: Date.now(), text: "낙관적 할 일" })}>
        할 일 추가 (0초 로딩 경험)
      </button>
    </div>
  );
}

```
