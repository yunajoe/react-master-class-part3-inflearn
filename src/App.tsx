import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import UserProfile from "./components/UserProfile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터를 5분간 '신선하다(Fresh)'고 믿게 합니다.
      // 이 시간 동안은 다시 접속해도 서버에 안 가고 캐시에서 즉시 꺼내 씁니다.
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>TanStack Query 관제 센터 🛰️</h1>
        <p>Query Key Factory가 생성한 주소로 데이터를 동기화합니다.</p>
        <hr />

        <div style={{ display: "flex", gap: "20px" }}>
          <UserProfile userId={1} />
          <UserProfile userId={1} />
        </div>
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
