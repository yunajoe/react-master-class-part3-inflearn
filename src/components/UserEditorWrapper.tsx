import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserEditor from "./UserEditor";
import UserProfile2 from "./UserProfile2";

const queryClient = new QueryClient();
function UserEditorWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <h1>TanStack Query Invalidation Lab 🧪</h1>
        <hr />
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
          <UserProfile2 id={1} />
          <UserEditor id={1} />
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default UserEditorWrapper;
