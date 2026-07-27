import { useEffect, useState } from "react";
import type { Post } from "../api/mockApi"; // ✅ Type-only import 적용
import { fetchPostById } from "../api/mockApi";

export default function BoilerplateHell() {
  const [postId, setPostId] = useState<number | string>("");
  const [data, setData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!postId) return;
    let isCancelled = false; // 🚩 Race condition 방어용 수동 플래그

    setIsLoading(true);
    fetchPostById(postId)
      .then((res) => {
        if (!isCancelled) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (!isCancelled) setError(err as Error);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    }; // 🧼 클린업을 통한 방어
  }, [postId]);

  return (
    <div style={{ border: "2px solid green", padding: "1rem", margin: "1rem" }}>
      <h3>🔥 3. 지옥의 보일러플레이트 (The Noise)</h3>
      <input
        type="number"
        onChange={(e) => setPostId(e.target.value)}
        placeholder="ID 입력"
      />
      {isLoading && <p>⌛ 로딩 중...</p>}
      <p>결과: {data?.title}</p>
    </div>
  );
}
