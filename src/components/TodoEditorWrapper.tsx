import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TodoEditor from "./TodoEditor";

function TodoEditorWrapper() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Optimistic UX Lab ⚡</h1>
        <hr />
        <TodoEditor />
      </main>
    </QueryClientProvider>
  );
}

export default TodoEditorWrapper;
