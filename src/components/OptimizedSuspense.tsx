import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import UserAndPosts from "./UserAndPosts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const GlobalSkeleton = () => (
  <div style={{ padding: "1rem", color: "#666" }}>
    ⌛ 모든 데이터를 병렬로 가져오는 중...
  </div>
);

function OptimizedSuspense() {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <h1>TanStack Query Optimization Lab 🧪</h1>
        <hr />

        <ErrorBoundary
          fallbackRender={({ error }) => {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            return (
              <div
                style={{
                  color: "red",
                  padding: "1.5rem",
                  border: "2px solid red",
                }}
              >
                ❌ 차단기 작동: {errorMessage}
              </div>
            );
          }}
        >
          <Suspense fallback={<GlobalSkeleton />}>
            <UserAndPosts id={1} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </QueryClientProvider>
  );
}

export default OptimizedSuspense;
