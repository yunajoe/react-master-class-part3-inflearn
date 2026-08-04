import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostEditor from "./PostEditor";

const queryClient = new QueryClient();

function PostEditorWrapper() {
  return (
    // QueryClientProvider를 통해 앱 전체에 TanStack Query 엔진의 컨텍스트를 주입
    // useMutation 역시 시스템 안에서 돌아가므로 반드시 이 Provider 하위에서 호출
    <QueryClientProvider client={queryClient}>
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>TanStack Query Mutation Lab 🧪</h1>
        <p>서버의 상태를 직접 바꾸는 행동 대장을 호출합니다.</p>
        <hr />
        <PostEditor />
      </main>
    </QueryClientProvider>
  );
}

export default PostEditorWrapper;
