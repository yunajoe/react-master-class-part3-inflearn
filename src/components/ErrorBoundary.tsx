import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import SuspenseUserProfile from "./SuspenseUserProfile";

const queryClient = new QueryClient();

const UserProfileSkeleton = () => (
  <div style={{ color: "#666", padding: "1.5rem", border: "2px dashed #ccc" }}>
    ⌛ 스켈레톤 UI가 데이터를 기다리는 중...
  </div>
);

const ErrorPage = ({ error }: { error: unknown }) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    <div style={{ color: "red", padding: "1.5rem", border: "2px solid red" }}>
      ❌ 차단기 작동: {errorMessage}
    </div>
  );
};

function ErrorBoundaryComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <h1>선언적 데이터 페칭 Lab 🧪</h1>
        <hr />
      </main>
      <ErrorBoundary fallbackRender={ErrorPage}>
        <Suspense fallback={<UserProfileSkeleton />}>
          <SuspenseUserProfile id={1} />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default ErrorBoundaryComponent;
