import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { ProfileSearch } from "./ProfileSearch";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 메모리에서 데이터가 삭제되는 시간입니다. 오프라인에서는 재요청이 불가능하므로, 이 시간을 길게 잡아 캐시가 증발하는 것을 방지
      gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지
      staleTime: 1000 * 60 * 5, // 5분간 신선한 데이터로 간주
    },
  },
});

const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
});

/**
 * [로직 3] 지속성 및 하이드레이션 설정 (시니어의 핵심 설계)
 */

// 앱이 다시 켜질 때 저장소에서 데이터를 읽어와 메모리를 즉시 채워주는 하이드레이션 과정을 자동으로 수행
persistQueryClient({
  queryClient,
  // 로컬 저장소는 문자열만 저장할 수 있습니다. 이 함수는 엔진의 JS 객체를 JSON 문자열로 직렬화하여 동기화
  persister: localStoragePersister,
  // 실무에서 데이터 형식이 바뀌었을 때, 사용자의 로컬에 남은 낡은 데이터를 싹 지워주는 '청소기' 역할
  buster: "v1-github-lab-2026",
  maxAge: 1000 * 60 * 60 * 24,
});

function ProfileSearchWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileSearch />;
    </QueryClientProvider>
  );
}

export default ProfileSearchWrapper;
