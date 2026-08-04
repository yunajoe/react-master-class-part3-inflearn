import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReloadEditor from "./ReloadEditor";

const queryClient = new QueryClient();

function ReloadWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReloadEditor />
    </QueryClientProvider>
  );
}

export default ReloadWrapper;
