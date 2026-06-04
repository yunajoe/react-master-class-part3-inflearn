import AuthStoreInitializer from "./AuthStoreInitializer";
import DashboardLayout from "./DashboardLayout";

async function HydrationPage() {
  // [1] 서버에서 보안을 유지하며 직접 데이터를 가져옵니다. (Mock Data)
  // 이 데이터는 클라이언트의 자바스크립트 번들에 포함되지 않아 매우 안전합니다.
  const userFromServer = { name: "React Expert", role: "Premium-VIP" };

  return (
    <div>
      <AuthStoreInitializer user={userFromServer} />
      <DashboardLayout />
    </div>
  );
}

export default HydrationPage;
