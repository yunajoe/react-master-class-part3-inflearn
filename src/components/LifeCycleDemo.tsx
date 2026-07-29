import { useQuery } from "@tanstack/react-query";
import { fetchUserData } from "../api/mockApi";
import { userKeys } from "../queries/queryKeys";

const styles = {
  container: {
    border: "2px solid #333",
    padding: "1.5rem",
    borderRadius: "12px",
    backgroundColor: "#f8f9fa",
  },
  pending: { padding: "1rem", color: "#666", fontStyle: "italic" },
  error: { color: "red", fontWeight: "bold" },
  fetching: { color: "#007bff", fontWeight: "bold" },
  guide: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#555",
    borderTop: "1px solid #ddd",
    paddingTop: "10px",
  },
};

function LifeCycleDemo() {
  const { data, isPending, isFetching, error } = useQuery({
    queryKey: userKeys.detail(1),
    queryFn: () => fetchUserData(1),
  });
  if (isPending)
    return (
      <div style={styles.pending}>
        ⌛ 최초 데이터를 가져오는 중입니다... (Pending)
      </div>
    );
  if (error)
    return <div style={styles.error}>❌ 에러 발생: {error.message}</div>;
  return (
    <div>
      <h3>유저 이름: {data.name}</h3>
      {isFetching && (
        <p style={styles.fetching}>
          🔄 백그라운드에서 데이터를 최신화하고 있습니다... (Fetching)
        </p>
      )}

      <div>
        <p>
          💡 <strong>Fresh 테스트:</strong> 2초 내에 창을 다시 클릭해보세요.
          아무 변화가 없습니다.
        </p>
        <p>
          💡 <strong>Stale 테스트:</strong> 2초 뒤 창을 다시 클릭하면 파란색
          메시지가 나타납니다.
        </p>
        <p>
          💡 <strong>Inactive 테스트:</strong> gcTime이 지나면 데이터가
          소멸됩니다.
        </p>
      </div>
    </div>
  );
}

export default LifeCycleDemo;
