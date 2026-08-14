import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserAdminPage } from "./components/adminPage";

// 테스트의 독립성을 위해 매번 새로운 인스턴스를 사용하거나 전역에서 관리합니다.
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main
        style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center" }}
      >
        <h1 style={{ color: "#6f42c1" }}>Section 4: Performance Lab 🧪</h1>
        <hr style={{ margin: "2rem 0", opacity: 0.1 }} />
        <UserAdminPage />
      </main>
    </QueryClientProvider>
  );
}
