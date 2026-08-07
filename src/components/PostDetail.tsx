import { useQuery } from "@tanstack/react-query";
import { fetchPostById } from "../api/mockApi2";

// useQuery 캐시 히트: 목록에서 이미 동일한 ['post', id] 키로 데이터를 프리페칭했다면,
// 상세 페이지의 useQuery는 isLoading을 거치지 않고 메모리에서 데이터를 즉시 꺼내 화면에 그립니다.
function PostDetail({ id, onBack }: { id: number; onBack: () => void }) {
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id),
  });
  if (isLoading)
    return (
      <div style={{ padding: "2rem" }}>
        ⌛ 프리페칭 실패 시 보이는 로딩 화면...
      </div>
    );
  return (
    <div
      style={{
        padding: "1rem",
        border: "2px solid #007bff",
        borderRadius: "12px",
        backgroundColor: "#f0f7ff",
      }}
    >
      <button onClick={onBack} style={{ marginBottom: "1rem" }}>
        ← 목록으로 돌아가기
      </button>
      <h2 style={{ color: "#007bff" }}>{post?.title}</h2>
      <p style={{ lineHeight: "1.6" }}>{post?.body}</p>
      <div style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>
        💡 이 화면은 프리페칭 덕분에 로딩 없이 즉시 렌더링되었습니다.
      </div>
    </div>
  );
}

export default PostDetail;
