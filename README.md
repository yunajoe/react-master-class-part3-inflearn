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
