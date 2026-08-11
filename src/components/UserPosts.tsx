import { useQuery } from "@tanstack/react-query";
import { fetchPostsByUserId, fetchUserByEmail } from "../api/postApi";

export const UserPosts = ({ email }: { email: string }) => {
  /**
   * [첫 번째 로직: 의존 관계의 시작]
   * 입력받은 이메일을 기반으로 유저 정보를 가져옵니다.
   * 이 데이터가 도착하기 전까지 userId는 undefined 상태를 유지합니다.
   */

  const { data: user } = useQuery({
    queryKey: ["user", email],
    queryFn: () => fetchUserByEmail(email),
  });

  const userId = user?.id as number;

  /**
   * [두 번째 로직: 조건부 트리거 및 타입 안전성]
   * !! 연산자를 통해 userId가 존재할 때만 쿼리를 활성화합니다.
   * enabled가 true라면 userId는 반드시 존재하므로 userId!를 사용합니다.
   */

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts", userId],
    queryFn: () => fetchPostsByUserId(userId),
    // !!userId: 더블 느낌표를 활용한 타입 변환 기법입니다. undefined일 때는 false, 값이 생기는 순간 true가 되어 두 번째 쿼리를 트리거
    enabled: !!userId,
  });

  /**
   * [최종 통합 로직: 사용자 피드백 설계]
   * 데이터 부재 시 조기에 리턴하여 런타임 에러를 원천 차단합니다.
   */

  if (!user || isPostsLoading) {
    return <div style={{ padding: "1rem" }}>데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div
      style={{
        padding: "1.5rem",
        border: "1px solid #4a90e2",
        borderRadius: "12px",
      }}
    >
      <h1>{user.name}님의 게시글</h1>
      <hr />
      <ul>
        {posts?.map((post) => (
          <li key={post.id} style={{ marginBottom: "10px" }}>
            <strong>{post.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};
