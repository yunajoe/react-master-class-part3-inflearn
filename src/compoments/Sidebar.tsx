import { useShallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { useAuthStore } from "../store/useHyratioinStore";
import { useOptimizationAuthStore } from "../store/useOptimizationAuthStore";

function Sidebar() {
  /* [Solution 1]: 원시 값(Primitive) 개별 구독 방식 */
  //   const name = useAuthStore((state) => state.user?.name);
  //   const role = useAuthStore((state) => state.user?.role);

  /* [Solution 2]: useShallow를 활용한 객체 구독 최적화 */

  const { name, role } = useAuthStore(
    useShallow((state) => ({
      name: state.user?.name,
      role: state.user?.role,
    })),
  );

  /* [Solution 3]:비즈니스 로직 기반의 정교한 렌더링 제어 */
  const isLoggedIn = useOptimizationAuthStore((state) => state.isLoggedIn);

  const user = useStoreWithEqualityFn(
    useOptimizationAuthStore,
    (state) => state.user,
    (prev, next) => {
      return (
        prev?.id === next?.id &&
        Math.abs((prev?.lastActive ?? 0) - (next?.lastActive ?? 0)) < 60000
      );
    },
  );
  return (
    <aside
      style={{
        border: "2px solid #4CAF50",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>사이드바 (최적화 완료)</h3>
      <p>
        사용자: <strong>{name || "비로그인"}</strong>
      </p>
      <p>
        권한: <strong>{role || "N/A"}</strong>
      </p>
    </aside>
  );
}

export default Sidebar;
