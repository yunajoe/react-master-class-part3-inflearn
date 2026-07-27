import { useEffect, useState } from "react";
import { fetchPostById, type Post } from "../api/mockApi";

function RaceCondition() {
  const [postId, setPostId] = useState<number | null>(null);
  const [data, setData] = useState<Post | null>(null);

  useEffect(() => {
    if (!postId) return;
    fetchPostById(postId).then((res) => {
      console.log(`✅ 데이터 도착: 포스트 ${postId}`);
      setData(res);
    });
  }, [postId]);
  return (
    <div style={{ border: "2px solid red", padding: "1rem", margin: "1rem" }}>
      <h3>🔥 1. 경쟁 상태 (Race Condition)</h3>
      <button onClick={() => setPostId(1)}>1번 포스트 (느림 - 사과)</button>
      <button onClick={() => setPostId(2)}>2번 포스트 (빠름 - 포도)</button>

      <p>
        현재 요청 ID: <strong>{postId || "없음"}</strong>
      </p>
      <p>
        화면 표시 제목: <mark>{data?.title || "데이터 없음"}</mark>
      </p>
    </div>
  );
}

export default RaceCondition;
