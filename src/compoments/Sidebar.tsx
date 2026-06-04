import { useDashboardStore } from "../store/useDashBoadStore";

function Sidebar() {
  const { name, role } = useDashboardStore((state) => ({
    name: state.user.name,
    role: state.user.role,
  }));

  console.log("🚨 [렌더링 발생] 사이드바가 다시 그려졌습니다!");

  return (
    <aside style={{ padding: "20px", border: "2px solid red", width: "200px" }}>
      <h3>Sidebar</h3>
      <p>유저: {name}</p>
      <p>역할: {role}</p>
    </aside>
  );
}

export default Sidebar;
