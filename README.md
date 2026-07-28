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
