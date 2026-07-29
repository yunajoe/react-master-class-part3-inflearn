### 58. 서버 상태 관리: useEffect 데이터 페칭의 재앙

1. 핵심 개요 (Overview)

- 목적: useEffect + useState 기반의 전통적인 서버 데이터 페칭 패턴이 실무에서 유발하는 치명적인 버그와 아키텍처적 한계를 파악함.

- 핵심 문제:
  a. 경쟁 상태 (Race Condition): 응답 도착 순서 불일치로 인한 '유령 데이터' 화면 덮어쓰기 발생.

  b. 중복 요청: 여러 컴포넌트가 동일 데이터를 각각 독립적으로 요청하여 네트워크 자원 낭비.

  c. 보일러플레이트 증대: 방어용 상태 관리 코드가 비즈니스 로직보다 커져 유지보수성 저하.

2. useEffect 데이터 페칭의 3대 재앙

- 1. 경쟁 상태 (Race Condition)

```javascript
/* [Bad]: 이전 요청을 취소하지 못해 나중에 도착한 느린 응답이 최신 데이터를 덮어씀 */
useEffect(() => {
  if (!postId) return;

  fetchPostById(postId).then((res) => {
    setData(res); // 1번 요청(3초)이 2번 요청(0.5초) 완료 후 도착하여 화면을 덮어버림
  });
}, [postId]);
```

- 2. 무분별한 중복 요청

```javascript

/* [Bad]: 동일한 API를 개별 컴포넌트에서 각각 중복 호출 */
function ProfileIcon() {
  const [user, setUser] = useState<User>();
  useEffect(() => { fetchUser().then(setUser); }, []);
  return <span>👤 {user?.name}</span>;
}

function Sidebar() {
  const [user, setUser] = useState<User>();
  useEffect(() => { fetchUser().then(setUser); }, []); // ❌ 동일 API 중복 호출
  return <aside>📧 {user?.name}</aside>;
}
```

3. 지옥의 보일러플레이트 (Boilerplate Hell)

```javascript
/* [Anti-Pattern]: 수동 플래그(isCancelled) 및 로딩/에러 관리가 코드를 지배함 */
useEffect(() => {
  if (!postId) return;
  let isCancelled = false; // 🚩 방어용 수동 플래그

  setIsLoading(true);
  fetchPostById(postId)
    .then(res => { if (!isCancelled) setData(res); })
    .catch(err => { if (!isCancelled) setError(err as Error); })
    .finally(() => { if (!isCancelled) setIsLoading(false); });

  return () => { isCancelled = true; }; // 🧼 클린업
}, [postId]);

```

| 테스트 항목           | 재현 방법 (수행)                                      | 현상 및 분석                                                                      |
| :-------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **1. 경쟁 상태**      | 1번 포스트(3초 지연) 클릭 직후 2번 포스트(0.5초) 클릭 | 2번 데이터가 뜬 후, 1.5초 뒤 늦게 도착한 1번 데이터가 화면을 덮어씀 (유령 데이터) |
| **2. 중복 요청**      | 화면에 `ProfileIcon`과 `Sidebar` 동시 마운트          | 화면상 1번만 필요한 유저 정보 API가 콘솔에 2회 연속 중복 호출됨                   |
| **3. 보일러플레이트** | `BoilerplateHell.tsx` 소스 코드 검토                  | `isCancelled`, `isLoading`, `error` 등 부수적인 방어 코드가 전체의 80% 이상 차지  |
| **4. 메모리 누수**    | 요청 응답이 오기 전 컴포넌트 언마운트                 | 클린업 미처리 시 사라진 컴포넌트의 상태를 업데이트하려는 경고/버그 발생           |

### 59. 서버 상태 관리: 가져오기(Fetching)에서 동기화(Synchronization)로의 패러다임 전환

1. 핵심 아키텍처 원칙 (Core Architecture Principles)

- 우리가 가장 먼저 머릿속에서 지워야 할 고정관념은 "서버 데이터는 내 컴포넌트의 상태"라는 생각입니다. useEffect를 쓸 때는 데이터를 억지로 useState 주머니에 넣으려 했지만, 서버 데이터는 클라이언트 소유가 아니라 잠시 빌려온 정보

```

1. 거울의 원칙 (Mirror Principle): 클라이언트는 데이터를 직접 소유하고 관리하는 주체가 아니라, 서버의 원본 데이터를 반영하는 거울이 되어야 합니다.

2. 지능형 정수기 시스템: 우물을 파러 매번 직접 가는 대신, 미리 물을 떠서 깨끗하게 필터링해 저장해 두었다가 버튼을 누르는 즉시 채워주는 시스템입니다.

3. SWR 전략 (Stale-While-Revalidate): 일단 캐시에 있는 '조금 오래된(Stale)' 데이터를 먼저 보여주고, 백그라운드에서 조용히 '신선한(Fresh)' 데이터를 가져와 교체하는 혁신적인 방식

```

| 구분              | Before: `useEffect` + `useState`                     | After: TanStack Query                                   |
| :---------------- | :--------------------------------------------------- | :------------------------------------------------------ |
| **관점**          | **가져오기 (Fetching)**: 필요할 때마다 찔러서 가져옴 | **동기화 (Synchronization)**: 서버 상태를 렌더링에 반영 |
| **데이터 소유권** | 컴포넌트 내부 상태 (`useState`)                      | 중앙화된 캐시 관제 센터 (`QueryClient`)                 |
| **경쟁 상태**     | 수동 방어 코드 (`isCancelled`) 필요                  | 엔진 차원의 자동 요청 취소 및 순서 보장                 |
| **중복 요청**     | 동일 API라도 컴포넌트 수만큼 N번 호출                | `queryKey` 기반 데두핑(Deduping)으로 1회만 호출         |
| **코드 스타일**   | **명령형 (Imperative)**: 상태 관리 로직 복잡         | **선언적 (Declarative)**: 상태에 따른 UI 표현에만 집중  |

2. 스텝 바이 스텝 구현 가이드

Step 1: 엔진 설치 및 중앙 관제 센터 설정

```bash
npm install @tanstack/react-query
```

```javascript
// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProfile from "./components/UserProfile";

// 1. 모든 쿼리의 상태와 캐시를 관리할 '중앙 뇌'를 생성 (컴포넌트 외부 선언)
const queryClient = new QueryClient();

export default function App() {
  return (
    // 2. Context API를 통해 하위 컴포넌트 전체에 엔진 기능 주입
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: "20px" }}>
        <h1>TanStack Query 관제 센터 🛰️</h1>
        {/* 동일 데이터를 쓰는 컴포넌트를 복수 배치하여 중복 요청 제거 검증 */}
        <UserProfile userId={1} />
        <UserProfile userId={1} />
      </div>
    </QueryClientProvider>
  );
}
```

Step 2: [Before] useEffect 수동 관리 방식 (Anti-Pattern)

```javascript
// src/components/OldUserProfile.tsx
import { useState, useEffect } from 'react';
import { fetchUserData } from '../api/mockApi';
import type { UserData } from '../api/mockApi';

export default function OldUserProfile({ userId }: { userId: number }) {
  // ❌ 1. 파편화된 상태 3개가 강제됨
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // ❌ 2. 경쟁 상태(Race Condition) 방어용 수동 플래그
    let isCancelled = false;
    setIsLoading(true);

    fetchUserData(userId)
      .then((res: UserData) => {
        // ❌ 3. "여전히 나를 원하는가?" 수동 검증
        if (!isCancelled) {
          setData(res);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (!isCancelled) setError(err as Error);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    // ❌ 4. 언마운트 시 클린업
    return () => { isCancelled = true; };
  }, [userId]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return <div>{data?.name}</div>;
}
```

Step 3: [After] TanStack Query 혁신 코드 (Modern Pattern)

```javascript
import { useQuery } from '@tanstack/react-query';
import { fetchUserData } from '../api/mockApi';
import type { UserData } from '../api/mockApi';

export default function UserProfile({ userId }: { userId: number }) {
  /**
   * ✨ useQuery<TData, TError>
   * 제네릭으로 데이터 및 에러 타입을 명시하여 완벽한 타입 안전성을 확보합니다.
   */
  const { data, isPending, error } = useQuery<UserData, Error>({
    // 1. queryKey: 데이터 식별 고유 주소 (배열 요소 변경 시 자동 동기화)
    queryKey: ['user', userId],

    // 2. queryFn: 서버 통신 대행 함수 (경쟁 상태 및 취소 자동 처리)
    queryFn: () => fetchUserData(userId),

    // 3. staleTime: 데이터를 5분간 '신선(Fresh)'하다고 간주 (캐시 즉시 반환)
    staleTime: 1000 * 60 * 5,
  });

  // 4. 선언적 UI 반환
  if (isPending) return <div>⌛ 엔진이 서버와 데이터를 동기화 중입니다...</div>;
  if (error) return <div>❌ 에러 발생: {error.message}</div>;

  return (
    <div style={{ border: '1px solid #ddd', padding: '1rem', margin: '10px' }}>
      <h4>유저 정보 (실시간 동기화)</h4>
      <p>이름: {data?.name}</p>
    </div>
  );
}
```

### 61. 동일 데이터를 5개 컴포넌트에서 호출할 때 발생하는 5번의 네트워크 요청

- "서버 데이터는 클라이언트가 소유하는 state가 아니라, 잠시 빌려와 서버와 지속적으로 맞추는 '동기화'의 대상이다."

1. Traditional: useEffect 페칭의 3대 재앙

2. Modern: TanStack Query로의 패러다임 전환

- TanStack Query는 가져오기(Fetching) 패러다임을 동기화(Synchronization) 패러다임으로 전환하여 이 문제들을 해결

```
┌─── 컴포넌트 A (ProfileIcon)
                  │
[ QueryClient ] ──┼─── 컴포넌트 B (Sidebar)      ───►  서버 API 요청 1회만 발생!
(중앙 캐시 관제 센터) │                                     (Deduping & Caching)
                  └─── 컴포넌트 C (QuickMenu)
```

🎯 핵심 해결 기법

```
1. 요청 중복 제거 (Deduping): 동일한 queryKey를 가진 요청은 여러 컴포넌트에서 동시에 실행되어도 단 1회만 서버에 전달하고 결과를 공

2. SWR (Stale-While-Revalidate) 캐싱: 캐시된 데이터(stale)를 사용자에게 즉시 보여주고, 백그라운드에서 신선한 데이터(fresh)를 가져와 매끄럽게 교체

3. 선언적 코드 구조: isPending, error, data 상태를 라이브러리가 알아서 추적하므로 개발자는 UI 표현에만 집중


```

3. 코드 패턴 비교 (Before vs After)

❌ [Before] 수동 방어 형태 (useEffect)

```javascript
// 상태 3개 + 경쟁 상태 방어 플래그 + 클린업 함수까지 수동 작성
useEffect(() => {
  let isCancelled = false;
  setIsLoading(true);

  fetchUser(id)
    .then((res) => {
      if (!isCancelled) setData(res);
    })
    .catch((err) => {
      if (!isCancelled) setError(err);
    })
    .finally(() => {
      if (!isCancelled) setIsLoading(false);
    });

  return () => {
    isCancelled = true;
  }; // 클린업 필수
}, [id]);
```

✨ [After] Modern 선언적 방식 (useQuery)

```javascript
// 단 한 줄의 선언으로 캐싱, 중복 제거, 경쟁 상태 자동 방어
const { data, isPending, error } = useQuery({
  queryKey: ["user", id],
  queryFn: () => fetchUser(id),
  staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
});
```

| 문제 유형                               | 발생 원인                                                                   | 결과 및 치명적 영향                                                              |
| :-------------------------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| **① 네트워크 자원 비극**<br>(중복 요청) | 컴포넌트마다 각자의 `useEffect`에서 동일한 API를 독립적으로 호출            | • 동일 요청 N회 발생 (네트워크 병목)<br>• 서버 DB 부하 및 비용 증가              |
| **② 경쟁 상태**<br>(Race Condition)     | 이전 비동기 요청이 완료되기 전에 새로운 요청이 발생하여 응답 순서가 꼬임    | • 느리게 도착한 이전 응답이 최신 데이터를 덮어씀<br>• 화면에 '유령 데이터' 표시  |
| **③ 보일러플레이트 지옥**               | 경쟁 상태 방어(`isCancelled`), 로딩(`isLoading`), 에러(`error`)를 수동 작성 | • 비즈니스 로직보다 방어용 코드가 80% 이상을 차지<br>• 가독성 및 유지보수성 저하 |

### 62. Stale-While-Revalidate: 사용자에게는 캐시를, 뒤에서는 갱신을

- TanStack Query는 SWR(Stale-While-Revalidate) 전략을 통해 "기다림 없는 사용자 경험"과 "최신 데이터 동기화"를 동시에 달성하는 지능형 관제 시스템

1. 🏛️ 아키텍처 핵심 원칙 3가지
   | 원칙 | 설명 | 비유 |
   | :--- | :--- | :--- |
   | **1. 요청 중복 제거**<br>(Deduplication) | 동일한 `queryKey` 요청이 동시에 발생하면 **단 1회만 실행**하고 결과를 모든 컴포넌트가 공유 | 3명이 같은 피자를 주문해도 **배달 오토바이는 1대만** 출동 |
   | **2. SWR 캐싱**<br>(Stale-While-Revalidate) | 만료된 데이터(`stale`)라도 먼저 캐시에서 즉시 꺼내 보여주고, 백그라운드에서 신선한 데이터(`fresh`)를 새로고침 | 식탁 위의 피자를 바로 먹으면서, 백그라운드에서 새 피자 주문 |
   | **3. 선언적 매니징**<br>(Declarative) | 로딩·에러·데이터 상태 관리를 매니저(`useQuery`)에게 위임하고, 컴포넌트는 규격에 맞게 렌더링에만 집중 | 주문 지시서만 전달하고 결과를 보고받는 구조 |
2. ⚙️ useQuery 핵심 옵션 및 데이터 흐름

```javascript
const { data, isPending, error } = useQuery<TData, TError>({
  queryKey: userKeys.detail(userId), // ① 데이터 고유 식별자 (바코드)
  queryFn: () => fetchUserData(userId), // ② 실제 데이터를 가져오는 심부름 지침서 (Promise)
  staleTime: 1000 * 60 * 5,            // ③ 데이터 신선도 유지 시간 (5분)
  gcTime: 1000 * 60 * 10,           // ④ 미사용 데이터 메모리 보관 시간 (10분)
});
```

- 반환 상태 (State)

```
- isPending: 데이터가 아예 없는 '첫 주문' 상태. (초기 로딩 처리 시 사용)
- data: 성공적으로 도착한 데이터 본체. (타입 지정을 통해 자동 완성 제공)
- error: 통신 중 실패 시 반환되는 에러 보고서.
```

- 핵심 타이머 (staleTime vs gcTime)

| 구분       | `staleTime` (신선도 유지)                      | `gcTime` (메모리 정리)                                 |
| :--------- | :--------------------------------------------- | :----------------------------------------------------- |
| **역할**   | 데이터가 **'신선(Fresh)'**하다고 판단하는 시간 | 컴포넌트 언마운트 후 캐시를 **메모리에 남겨두는** 시간 |
| **동작**   | 시간 내 재요청 시 **서버 호출 없이 캐시 반환** | 시간이 지나면 가비지 컬렉터가 **캐시 메모리에서 삭제** |
| **기본값** | `0` (즉시 stale 상태로 지정)                   | `5분` (`staleTime`보다 항상 크거나 같아야 함)          |

3. 🧪 중복 요청 제거 실증 (Disaster Solved)

- 동일한 queryKey를 사용하는 컴포넌트 3개를 화면에 동시에 올려도, TanStack Query 관제 센터가 이를 하나의 요청으로 묶어 처리합니다.

```javascript
// App.tsx: 동일한 userId(1)를 가진 컴포넌트 3개 동시 마운트
<QueryClientProvider client={queryClient}>
  <UserProfile userId={1} />
  <UserProfile userId={1} />
  <UserProfile userId={1} />
</QueryClientProvider>
```

### 63. 서버 상태 관리: Fresh, Stale, Inactive 상태와 데이터 생애주기(Lifecycle)

1. 핵심 개요 (Overview)

- 목적: 단순히 staleTime이 지나면 데이터가 상한다고 외우는 수준을 넘어, Fresh · Stale · Inactive 3대 상태 전이 메커니즘과 백그라운드 동기화(SWR) 및 가비지 컬렉션 과정을 통제함.

- 핵심 메커니즘:

```
a. Fresh (신선): 캐시 데이터를 즉시 반환하며 서버 요청을 발생시키지 않음.
b. Stale (상함): 캐시 데이터를 사용자에게 먼저 보여주며(SWR), 백그라운드에서 백그라운드 동기화(isFetching)를 트리거함.
c. Inactive (비활성): 해당 데이터를 사용하는 모든 컴포넌트가 언마운트된 상태로, gcTime 타이머가 동작하여 메모리에서 영구 삭제

```

2. 데이터의 3대 핵심 상태 (Core States)

```
[Fetch Complete] ──► (Fresh) ──(staleTime 만료)──► (Stale) ──(Unmount)──► (Inactive) ──(gcTime 만료)──► [Memory Garbage Collected]
```

| 상태 (State)                | 정의 및 특징                                           | 컴포넌트 재마운트 / 창 포커스 시 동작                               |
| :-------------------------- | :----------------------------------------------------- | :------------------------------------------------------------------ |
| **Fresh**<br>(신선)         | 엔진이 "서버 값과 100% 일치한다"고 보증하는 기간       | **네트워크 요청 없음**. 메모리 캐시만 즉시 반환                     |
| **Stale** ⚠️<br>(상함)      | 데이터가 서버와 다를 수 있다고 의심하는 상태           | **캐시 반환 + 백그라운드 Refetch** (`isFetching: true`) 동시에 실행 |
| **Inactive** 💤<br>(비활성) | 데이터를 구독하는 컴포넌트가 화면에서 모두 사라진 상태 | **`gcTime` 타이머 가동**. 타이머 종료 시 캐시 영구 삭제             |

3. 스텝 바이 스텝 구현 가이드 (Speed Test Lab)

- Step 1. 가짜 API 및 타입 정의 (src/api/mockApi.ts)

```javascript

export interface User {
  id: number;
  name: string;
}

export const fetchUser = async (id: number): Promise<User> => {
  console.log(`📡 [Network Log] 서버와 데이터(ID: ${id}) 동기화 시도 중...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "시니어 아키텍트" });
    }, 1000); // 1초 지연을 두어 isPending과 isFetching을 visual하게 구분
  });
};

```

- Step 2. 쿼리 키 공장 (src/queries/queryKeys.ts)

```javascript
export const userKeys = {
  all: ['users'] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
};
```

- Step 3. 메인 관제 센터 설정 - 초고속 테스트 모드 (src/App.tsx)

```javascript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LifecycleDemo from "./components/LifecycleDemo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 2, // 2초 후 Stale 상태 전환
      gcTime: 1000 * 5, // 언마운트 후 5초 지나면 가비지 컬렉션
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>TanStack Query Lifecycle Lab 🧪 (Speed Ver.)</h1>
        <p>2초 뒤에 데이터가 상하는 것을 목격하세요!</p>
        <hr />
        <LifecycleDemo />
      </div>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}
```

- Step 4. 생애주기 실증 컴포넌트 (src/components/LifecycleDemo.tsx)

```javascript
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../api/mockApi';
import { userKeys } from '../queries/queryKeys';
import type { User } from '../api/mockApi';

const styles = {
  container: { border: '2px solid #333', padding: '1.5rem', borderRadius: '12px', backgroundColor: '#f8f9fa' },
  pending: { padding: '1rem', color: '#666', fontStyle: 'italic' },
  error: { color: 'red', fontWeight: 'bold' },
  fetching: { color: '#007bff', fontWeight: 'bold' },
  guide: { marginTop: '20px', fontSize: '14px', color: '#555', borderTop: '1px solid #ddd', paddingTop: '10px' }
};

export default function LifecycleDemo() {
  const { data, isPending, isFetching, error } = useQuery<User, Error>({
    queryKey: userKeys.detail(1),
    queryFn: () => fetchUser(1),
  });

  // 1. 캐시가 아예 없는 최초 1회 진입 시 (Pending)
  if (isPending) return <div style={styles.pending}>⌛ 최초 데이터를 가져오는 중입니다... (Pending)</div>;
  if (error) return <div style={styles.error}>❌ 에러 발생: {error.message}</div>;

  return (
    <div style={styles.container}>
      <h3>유저 이름: {data.name}</h3>

      {/* 2. Stale 상태에서 재요청 시: 데이터는 보여주면서 백그라운드 갱신 (Fetching) */}
      {isFetching && (
        <p style={styles.fetching}>
          🔄 백그라운드에서 데이터를 최신화하고 있습니다... (Fetching)
        </p>
      )}

      <div style={styles.guide}>
        <p>💡 <strong>Fresh 테스트:</strong> 2초 내에 창을 다시 클릭해보세요. 아무 변화가 없습니다.</p>
        <p>💡 <strong>Stale 테스트:</strong> 2초 뒤 창을 다시 클릭하면 파란색 메시지가 나타납니다.</p>
        <p>💡 <strong>Inactive 테스트:</strong> 컴포넌트 언마운트 후 gcTime(5초)이 지나면 메모리에서 소멸됩니다.</p>
      </div>
    </div>
  );
}

```

4. 상태 및 플래그 조합 정리
   | 구분 | `isPending` | `isFetching` | 설명 |
   | :--------------------- | :---------- | :----------- | :--------------------------------------------------------------------- |
   | **최초 페칭** | `true` | `true` | 캐시된 데이터가 없어 화면에 로딩 UI를 표시해야 함. |
   | **Fresh 상태** | `false` | `false` | 신선한 데이터를 캐시에서 즉시 꺼내 보여주며 네트워크 요청 없음. |
   | **Stale 재검증 (SWR)** | `false` | `true` | 이전 데이터를 화면에 유지한 채 백그라운드에서 몰래 새 데이터를 가져옴. |

5. Stale 상태에서의 Query

- 백그라운드 동기화 및 비교 과정 (Structural Sharing)

```
1. Stale 상태에서 트리거 발생
- 화면 재포커스, 탭 전환, 네트워크 재연결, 혹은 컴포넌트 재마운트 시 백그라운드 요청(isFetching: true)이 나갑니다.

2. 서버 응답 도착
- 서버에서 최신 응답을 받아옵니다.

3. 구조적 공유 (Structural Sharing) 비교
- 리액트 쿼리는 단순히 전체를 무조건 덮어씌우는 것이 아니라, 기존 캐시 데이터와 새로 온 서버 데이터를 비교합니다.
- 데이터가 같다면: 메모리 참조(Reference)를 그대로 유지합니다. (불필요한 리렌더링 방지)
- 데이터가 다르다면: 변경된 데이터 객체/배열의 참조를 새것으로 업데이트하고 캐시를 교체합니다.

```

- 데이터가 바뀌었을 때 화면의 변화

```
- 데이터의 참조가 새 데이터로 바뀌는 순간, 리액트 쿼리의 useQuery 훅이 이를 감지하고 컴포넌트를 자동으로 리렌더링합

- 사용자 입장: 화면을 계속 보고 있던 사용자는 별도의 뒤로 가기나 새로고침 없이, 백그라운드 요청이 완료되는 순간 화면의 글자나 값이 자연스럽게 최신 데이터로 바뀌는 것을 보게 됩니다.

- 개발자 입장: 데이터 비교나 setState 같은 코드를 작성할 필요 없이, useQuery가 알아서 최신 데이터로 렌더링을 일으켜 줍니다.

```

- 요약

```
- 데이터가 서버와 다를 때: 캐시 데이터를 최신 서버 데이터로 교체하고, 화면을 자동 리렌더링하여 최신화합니다.

- 데이터가 서버와 같을 때: 데이터가 바뀌지 않았음을 인지하고 불필요한 화면 리렌더링을 일으키지 않습니다.

```
