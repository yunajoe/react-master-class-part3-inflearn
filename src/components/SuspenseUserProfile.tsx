import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchUserDetail } from "../api/mockApi";
import { userKeys } from "../queries/queryKeys";

const styles = {
  container: {
    border: "2px solid #333",
    padding: "1.5rem",
    borderRadius: "12px",
    backgroundColor: "#f8f9fa",
  },
  avatar: { width: "80px", borderRadius: "50%" },
};

function SuspenseUserProfile({ id }: { id: number }) {
  const { data: user } = useSuspenseQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUserDetail(id),
  });
  return (
    <div style={styles.container}>
      <img src={user.avatar} alt={user.name} style={styles.avatar} />
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

export default SuspenseUserProfile;
