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
