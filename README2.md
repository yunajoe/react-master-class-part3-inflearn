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

### 71. 수동 무한 스크롤의 한계와 고통 정리

1. 무한 스크롤 수동 구현이란? (누적형 데이터와 상태의 비대화)

- 단일 페이지 데이터를 교체하는 일반 페이지네이션과 달리, 이전 데이터를 보존하며 새 데이터를 배열 뒤에 누적해서 이어 붙이는 방식

```
1. 상태의 비대화 (State Bloating): 데이터, 페이지 커서, 다음 페이지 여부, 로딩 상태 등 수많은 useState 선언 필요.
2. 명령형 상태 제어: 페이지 번호 증가, 종료 조건 판단, 배열 병합 등 모든 로직을 개발자가 직접 계산하고 지시해야 함.
3. 경합 조건 (Race Condition): 광클릭이나 스크롤 중복 요청 발생 시 동일 페이지 요청이 여러 번 날아가 중복 데이터 발생 위험
4. 커서/페이지 계산: 응답 결과 길이를 직접 확인하여 termination condition(hasNextPage = false) 및 pageParam + 1 처리.
5. 성능과 가독성의 충돌: 데이터가 많아질수록 [...prev, ...newPosts] 코드는 매번 거대한 배열을 새로 생성해야 하므로 비효율적
6. 부수 효과의 관리: 스크롤 위치를 유지하거나, 특정 아이템만 삭제했을 때 전체 페이지 인덱스가 꼬이는 현상을 수동으로 해결하려면 수백 줄의 코드가 추가로 필요
7. 스크롤 이벤트 결합의 어려움: 현재는 버튼 클릭이지만, 실제 서비스에서는 Intersection Observer와 결합해야 합니다. 이때 데이터 로직과 DOM 감시 로직이 한데 뒤섞여 컴포넌트의 순수성이 파괴
```

```javascript
import { useState } from 'react';
import { fetchPostsManual } from '../api/mockApi';
import type { Post } from '../api/mockApi';

export default function ManualScroll() {
  // 🚩 [Pain 1] 관리해야 할 4가지 핵심 상태값들
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [pageParam, setPageParam] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchMorePosts = async () => {
    // 🚩 [Pain 2] 수동 가드 로직 (중복 호출 방지)
    if (!hasNextPage || isFetching) return;

    setIsFetching(true);
    try {
      const newPosts = await fetchPostsManual(pageParam);

      if (newPosts.length === 0) {
        setHasNextPage(false);
      } else {
        /**
         * 🚩 [Pain 3] 데이터 이어 붙이기 (Manual Concatenation)
         * 스프레드 연산자를 사용하여 기존 배열 뒤에 새 배열을 강제로 합침
         */
        setAllPosts((prev) => [...prev, ...newPosts]);

        // 🚩 [Pain 4] 페이지 번호 수동 계산
        setPageParam((prev) => prev + 1);
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {allPosts.map((post) => (
          <li key={post.id} style={{ padding: '0.8rem', borderBottom: '1px solid #eee' }}>
            {post.title}
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <button
          onClick={fetchMorePosts}
          disabled={isFetching}
          style={{ width: '100%', padding: '1rem', cursor: 'pointer' }}
        >
          {isFetching ? '⏳ 데이터 로딩 중...' : '➕ 게시글 더 보기'}
        </button>
      )}
    </div>
  );
}

```

### 72. TanStack Query useInfiniteQuery 완벽 정리

1. useInfiniteQuery란? (상태 관리의 자동화)

- 수동으로 관리하던 페이지 번호, 로딩 상태, 배열 병합([...prev, ...next]) 등의 로직을 엔진 내부에서 자동화하여 무한 스크롤을 손쉽게 구축하는 전용 훅

```
<!-- 장점 -->
1. 자동화된 상태 관리: fetchNextPage, hasNextPage, isFetchingNextPage 등 필수 상태 및 컨트롤러 기본 제공.
2. 정밀한 캐시 제어: 데이터를 단일 배열이 아닌 페이지 단위 주머니(이중 배열)로 나누어 관리하므로 특정 페이지 교체/무효화 용이.
3. 최적화 옵션 지원: maxPages를 통한 메모리 관리, staleTime을 통한 과도한 백그라운드 재요청 방지.
```

2. 실습 가이드

```javascript
import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import { fetchPosts } from '../api/jsonPlaceholder';
import type { Post } from '../api/jsonPlaceholder';

export default function InfinitePostList() {
  /**
   * useInfiniteQuery의 5가지 제네릭:
   * 1. TQueryFnData: API 반환 타입 (Post[])
   * 2. TError: 에러 타입 (Error)
   * 3. TData: 최종 캐시 구조 (InfiniteData<Post[], number>)
   * 4. TQueryKey: 쿼리 키 타입 (string[])
   * 5. TPageParam: 페이지 파라미터 타입 (number)
   */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<Post[], Error, InfiniteData<Post[], number>, string[], number>({
    queryKey: ['posts', 'infinite'],

    // 1. queryFn: 엔진이 전달하는 pageParam으로 API 호출
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),

    // 2. getNextPageParam: 마지막 페이지 분석 후 다음 pageParam 반환 (undefined 반환 시 종료)
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },

    // 3. initialPageParam: 첫 요청 시 사용할 기본 페이지값
    initialPageParam: 1,

    // 4. maxPages: 메모리 관리를 위해 유지할 최대 페이지 수 제한
    maxPages: 5,

    // 5. staleTime: 화면 전환/재이탈 시 누적된 전체 페이지 재요청 폭풍 방지
    staleTime: 1000 * 60 * 5,
  });

  // 이중 배열 주머니(pages)를 단일 리스트로 가볍게 평면화
  const allPosts = data?.pages.flatMap((page) => page) ?? [];

  if (status === 'pending') return <div>🚀 초기 데이터를 불러오는 중...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {allPosts.map((post) => (
          <li key={post.id} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
            <strong>{post.id}. {post.title}</strong>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{post.body.substring(0, 80)}...</p>
          </li>
        ))}
      </ul>

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: hasNextPage ? '#007bff' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: hasNextPage ? 'pointer' : 'not-allowed'
        }}
      >
        {isFetchingNextPage ? '⏳ 불러오는 중...' : hasNextPage ? '➕ 게시글 더 보기' : '🏁 마지막 페이지입니다'}
      </button>
    </div>
  );
}
```

3. 심층 아키텍처 및 실무 최적화 정리

- 데이터를 단일 배열이 아닌 페이지 단위 주머니(이중 배열)로 분할 관리하는 이유

```
- O(N) 순회 비용 절감: 만약 1만 개의 데이터를 단일 배열로 다루면, 데이터 하나를 수정할 때 전체 1만 번을 순회해야 함.
- 정밀한 부분 갱신: 페이지 단위로 분할되어 있어 특정 페이지의 데이터만 정밀하게 타격하여 수정하거나 무효화(Invalidate)할 수 있음.
- 불필요한 리렌더링 방지: 변경이 필요한 주머니(페이지)만 교체하여 메모리 연산과 UI 업데이트 최적화.

```

- maxPages의 실무적 가치 (메모리 누수 방지)

```
- 스크롤이 깊어질수록 과도하게 데이터가 쌓이는 메모리 폭증 현상을 방지하는 옵션
- 윈도우: maxPages: 5 설정 시, 6페이지를 불러오면 가장 오래된 1페이지 데이터를 메모리에서 자동으로 제거.
- 메모리 점유율 방어: 저사양 기기나 모바일 환경에서 무한 스크롤 진행 시 발생할 수 있는 브라우저 튕김/버벅임 현상 차단.
- Virtual List 연동: TanStack Virtual 등의 가상 리스트 라이브러리와 조합 시 메모리 및 DOM 노드 수를 완벽하게 제어.
```

- staleTime 설정의 필수성 (네트워크 재요청 폭풍 방지)

```
- 누적형 데이터 구조에서 발생할 수 있는 서버 과부하(Waterfall Fetching) 방지
- 기본값(staleTime: 0)의 위험: 사용자가 탭을 전환하거나 윈도우 포커스를 다시 얻을 때, 지금까지 누적된 20~30개 페이지 전체를 한꺼번에 재요청함.
- 서버 과부하 방지: 적절한 staleTime(예: 5분)을 부여하여 데이터의 신선도를 유지하고, 불필요한 백그라운드 재요청 폭풍을 차단.

```

### 73. Prefetching 전략: 사용자의 발걸음보다 한발 앞서 데이터를 준비하는 기술

1. 핵심 개념

- 프리페칭(Prefetching): 사용자가 데이터를 필요로 하기 직전에 백그라운드에서 미리 데이터를 가져와 캐시에 저장하는 기법
- 핵심 목적: 로딩 스피너와 지연 시간을 없애 "로딩 UI가 없는 듯한" 최상급 UX 제공

2. 개념

| 구분            | [상황 1] 마우스 호버 프리페칭              | [상황 2] 선제적 무한 스크롤                    |
| :-------------- | :----------------------------------------- | :--------------------------------------------- |
| **트리거 조건** | 리스트 아이템 마우스 올림 (`onMouseEnter`) | 스크롤 하단 요소 감지 (`IntersectionObserver`) |
| **실행 로직**   | `queryClient.prefetchQuery()`              | `fetchNextPage()`                              |
| **적용 효과**   | 클릭 즉시 상세 페이지 전환 (지연 0초)      | 스크롤이 바닥에 닿기 전 다음 페이지 로딩 완료  |

3. 요약

```
- Prefetching (프리페칭): 사용자가 특정 데이터를 필요로 하기 직전에 백그라운드에서 미리 캐시를 채우는 전략입니다.

- staleTime (신선도 유지 시간): 프리페칭의 생명줄입니다. 이 값이 0이면 프리페칭으로 데이터를 가져오더라도 실제 진입 시 엔진이 "낡은 데이터"로 간주하여 서버를 다시 찌릅니다. 반드시 넉넉한 시간(예: 5분)을 부여해야 합니다.

- Intersection Observer: 브라우저 뷰포트와 특정 요소의 교차 지점을 관찰하는 기술입니다. 스크롤 바닥에 닿기 전 선제적 가시성 트리거를 당기기 위한 표준 도구입니다

- 자원 효율성의 균형: 무조건 미리 가져오는 것이 능사는 아닙니다. 사용자가 보지도 않을 데이터를 무한정 프리페칭하는 것은 서버 비용 증가와 사용자의 데이터 낭비를 초래합니다. "꼭 클릭할 것 같은 찰나(Hover)"를 잡는 것이 실력

- Race Condition 방어: 탄스택 쿼리 엔진은 동일한 키에 대해 이미 프리페칭이 진행 중일 때 사용자가 클릭을 하면, 새로운 요청을 보내지 않고 기존 요청을 재사용합니다. 즉, 중복 요청을 엔진이 알아서 합쳐줍니다


```

### 74. 데이터 공백기와 CLS (Cumulative Layout Shift)

- 핵심 문제: 데이터 공백기와 CLS (Cumulative Layout Shift)

```
queryKey가 변경되면 TanStack Query는 새로운 데이터를 요청하며 기존 데이터를 버리고 data: undefined 상태로 들어갑니다. 이로 인해 리스트 영역이 순간적으로 소멸하면서 하단 레이아웃이 위로 솟구치는 시각적 깜빡임과 layout shift 현상이 발생

1. 데이터의 증발: 검색어 입력 시 기존 결과 목록이 즉시 사라짐
2. 공간 실종 (CLS): 리스트 높이가 0px가 되면서 푸터 등 하단 UI가 끌려 올라옴
3. UX 단절: 로딩 스피너 전환 시 사용자의 시각적 흐름 파괴 및 불안감 유발

```

| 구분                | 발생 원인                                                    | 시각적 영향                                 |
| :------------------ | :----------------------------------------------------------- | :------------------------------------------ |
| **Query Key 변경**  | 새로운 키 생성 시 기존 데이터를 즉시 하드 리셋(Hard Reset)함 | `data`가 `undefined`로 즉시 초기화          |
| **조건부 렌더링**   | `isLoading`일 때 리스트 요소 전체를 DOM에서 제거             | 공간 높이가 `0px`로 축소                    |
| **브라우저 Reflow** | 영역 소멸로 인해 하단 요소의 위치 재계산                     | 푸터가 검색창 바로 밑으로 솟구치는 CLS 발생 |

### 75. 아키텍처 원칙: 대역 데이터와 상태의 재정의

- TanStack Query v5의 placeholderData: keepPreviousData 옵션을 활용하면 queryKey가 변경되어도 기존 데이터를 즉시 삭제하지 않고 새 데이터가 도착할 때까지 화면을 유지합니다.

```
1. 시각적 연속성: 데이터 요청 중에도 이전 리스트를 '대역(Stand-in)'으로 유지하여 UI 삭제 및 깜빡임 원천 차단

2. 레이아웃 고정: minHeight 설정을 병행해 리스트 항목 수 변경 시 발생하는 CLS(Cumulative Layout Shift) 방어

3. 직관적 피드백: isPlaceholderData로 이전 데이터임을 알리고(opacity: 0.5), isFetching으로 업데이트 진행 상황만 가볍게 노출



```

### 76. select 옵션으로 컴포넌트 맞춤형 데이터 가공

1. 도입 배경 및 개념

- 문제점: 서버는 범용성을 위해 Raw Data(날것의 데이터)를 보내주어 UI 관점에서 비효율 발생.

- 해결책 (select): 쿼리 단에서 데이터를 필요한 형태로 Transformation(가공)하여 컴포넌트에 전달하는 기능.

2. 핵심 용어

- Raw Data: 서버 API가 응답하는 가공되지 않은 전체 객체.

- Transformation: 원본 데이터를 UI 사용 목적에 맞춰 정제/가공하는 과정.

- Memoization: 연산 결과 메모리 재사용. 가공 결과가 동일하면 불필요한 컴포넌트 리렌더링 차단.

- TData: useQuery<TQueryFnData, TData TError,> 제네릭의 세 번째 인자로, 최종 가공된 데이터의 타입.

| 구분            | 컴포넌트 본문 가공 (비권장)            | select 옵션 가공 (권장)                     |
| :-------------- | :------------------------------------- | :------------------------------------------ |
| **관심사 분리** | UI 로직과 데이터 가공 로직이 혼재      | UI 표현과 데이터 가공의 완전한 분리         |
| **연산 시점**   | 컴포넌트가 리렌더링될 때마다 반복 실행 | 서버 데이터 수신/변경 시에만 1회 실행       |
| **리렌더링**    | 무관한 데이터 변경에도 무조건 리렌더링 | 가공 결과(최종 데이터) 변경 시에만 리렌더링 |
| **타입 안정성** | 추가 변수 선언 시 타입 추론 복잡       | TData 제네릭을 통한 자동 타입 추론          |
