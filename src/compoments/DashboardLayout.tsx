import { useAuthStore } from "../store/useHyratioinStore";

function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  return (
    <div>
      <header
        style={{
          padding: "20px",
          background: "#f4f4f4",
          borderBottom: "1px solid #ddd",
        }}
      >
        👤 현재 접속 유저: <strong>{user?.name}</strong>
      </header>
    </div>
  );
}

export default DashboardLayout;
