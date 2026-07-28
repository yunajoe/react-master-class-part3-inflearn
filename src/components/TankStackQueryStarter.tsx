import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProfile from "./UserProfile";

const queryClient = new QueryClient();

function TankStackQueryStarter() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ padding: "20px" }}>
        <h1>TanStack Query 관제 센터 🛰️</h1>
        <UserProfile userId={1} />
        <UserProfile userId={1} />
      </div>
    </QueryClientProvider>
  );
}

export default TankStackQueryStarter;
