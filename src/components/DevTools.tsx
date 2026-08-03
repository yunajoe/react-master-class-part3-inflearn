import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import LifeCycleDemo from "./LifeCycleDemo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 도착하고 2초가 지나면 즉시 Stale 상태로 전이
      staleTime: 1000 * 2,
      // 컴포넌트가 언마운트된 후 5초가 지나면 가비지 컬렉터가 메모리를 비움
      gcTime: 1000 * 5,
    },
  },
});
function DevTools() {
  const [showDemo, setShowDemo] = useState(true);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
          <h1>TanStack Query 관제 센터 🛰️</h1>

          {/* 2. 언마운트를 유도하는 스위치 버튼 */}
          <button
            onClick={() => setShowDemo((prev) => !prev)}
            style={{
              padding: "10px 16px",
              marginBottom: "1rem",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: showDemo ? "#ff4d4f" : "#52c41a",
              color: "#fff",
            }}
          >
            {showDemo
              ? "🙈 컴포넌트 숨기기 (언마운트)"
              : "🐵 컴포넌트 보이기 (재마운트)"}
          </button>

          {/* 3. 조건부 렌더링으로 컴포넌트를 완전히 언마운트 시킴 */}
          {showDemo ? (
            <LifeCycleDemo />
          ) : (
            <div
              style={{
                padding: "1.5rem",
                borderRadius: "8px",
                backgroundColor: "#fffbe6",
                border: "1px solid #ffe58f",
                color: "#d48800",
              }}
            >
              💤 <strong>컴포넌트가 언마운트되었습니다!</strong>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px" }}>
                하단 Devtools를 확인해보세요. 쿼리 뱃지가{" "}
                <strong>gray (inactive)</strong>로 바뀌었고,
                <strong>5초 뒤</strong> 메모리에서 완전히 소멸(삭제)됩니다.
              </p>
            </div>
          )}
        </div>

        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </div>
  );
}

export default DevTools;
