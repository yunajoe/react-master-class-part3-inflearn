import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import SuspenseUserProfile from "./SuspenseUserProfile";

const UserProfileSkeleton = () => (
  <div style={{ color: "#666", padding: "1.5rem", border: "2px dashed #ccc" }}>
    ⌛ 스켈레톤 UI가 데이터를 기다리는 중...
  </div>
);
const queryClient = new QueryClient();

function ErrorBoundaryComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <h1>선언적 데이터 페칭 Lab 🧪</h1>
        <hr />
      </main>

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
        <Suspense fallback={<UserProfileSkeleton />}>
          <SuspenseUserProfile id={0} />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default ErrorBoundaryComponent;
