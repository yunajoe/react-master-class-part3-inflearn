import { useQuery } from "@tanstack/react-query";
import { fetchUsers, type User } from "../api/userApi";

export const UserDisplay = () => {
  //    * 제네릭: <User[](원본), Error, string[](가공된 타입)>
  const { data: userNames } = useQuery({
    queryKey: ["users", "names"],
    queryFn: fetchUsers,
    /**
     * [셰프의 기술]
     * 서버에서 받아온 User[]를 string[]으로 변환합니다.
     * 데이터가 없을 때를 대비해 옵셔널 체이닝(?.)을 사용하는 것이 포인트!
     */
    select: (users) => users?.map((u) => u.name),
  });

  /**
   * [Case 2] 활성 유저 숫자만 추출 (어댑터 패턴)
   * 컴포넌트는 방대한 리스트를 구독하지 않고 오직 '숫자' 하나만 구독합니다.
   */
  const { data: activeCount } = useQuery<User[], Error, number>({
    queryKey: ["users", "active-count"],
    queryFn: fetchUsers,
    select: (users) => users?.filter((u) => u.isActive).length ?? 0,
  });

  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px solid #ddd",
        borderRadius: "12px",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ color: "#007bff" }}>현재 활성 유저: {activeCount}명</h2>
      <hr />
      <h4>전체 유저 이름 리스트</h4>
      <ul style={{ lineHeight: "1.8" }}>
        {userNames?.map((name) => (
          <li key={name}>
            <strong>{name}</strong>
          </li>
        ))}
      </ul>
      <p style={{ fontSize: "0.8rem", color: "#888" }}>
        💡 이메일이나 주소가 바뀌어도 이름 목록이 같으면 이 컴포넌트는
        리렌더링되지 않습니다.
      </p>
    </div>
  );
};
