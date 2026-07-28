import { useQuery } from "@tanstack/react-query";
import { fetchUserData, type UserData } from "../api/mockApi";
import { userKeys } from "../queries/queryKeys";

function UserProfile({ userId }: { userId: number }) {
  const { data, isPending, error } = useQuery<UserData, Error>({
    // queryKey: 엔진이 데이터를 식별할 고유한 주소(ID)
    queryKey: userKeys.detail(userId),
    // queryFn: 실제로 서버와 통신을 담당할 '실행 대행인'입니다.
    // fetch, axios 등을 여기서 실행합니다. 경쟁 상태와 요청 취소는 엔진이 알아서 처리
    queryFn: () => fetchUserData(userId),
  });
  if (isPending) return <div>⌛ 엔진이 서버와 데이터를 동기화 중입니다...</div>;
  if (error) return <div>❌ 에러 발생: {error.message}</div>;

  return (
    <div style={{ border: "1px solid #ddd", padding: "1rem", margin: "10px" }}>
      <h4>유저 정보 (실시간 동기화)</h4>
      <p>이름: {data?.name}</p>
    </div>
  );
}

export default UserProfile;
