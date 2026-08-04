import { useQuery } from "@tanstack/react-query";
import { fetchUserApi } from "../api/mockApi2";
import { userKeys } from "../queries/queryKeys";

export default function UserProfile({ id }: { id: number }) {
  const { data: user, isLoading } = useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserApi(id),
  });

  if (isLoading) return <div>유저 정보 로딩 중...</div>;

  return (
    <div
      style={{ padding: "1rem", border: "2px solid #333", borderRadius: "8px" }}
    >
      <h2>현재 유저 이름: {user?.name}</h2>
      <p>ID: {user?.id}</p>
    </div>
  );
}
