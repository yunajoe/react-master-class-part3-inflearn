// 여기에 마우스 호버 시 상세 데이터 프리페칭과 무한 스크롤 선제적 대응 로직이 모두 담겨 있습니다.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import PostDetail from "./PostDetail";
import PostList from "./PostList";

const queryClient = new QueryClient();

function PostListWrapper() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  return (
    <QueryClientProvider client={queryClient}>
      <main
        style={{
          padding: "2rem",
          maxWidth: "600px",
          margin: "0 auto",
          fontFamily: "sans-serif",
        }}
      >
        <h1>Prefetching Lab 🛰️</h1>
        <hr />
        {selectedId ? (
          <PostDetail id={selectedId} onBack={() => setSelectedId(null)} />
        ) : (
          <PostList onSelect={setSelectedId} />
        )}
      </main>
    </QueryClientProvider>
  );
}

export default PostListWrapper;
