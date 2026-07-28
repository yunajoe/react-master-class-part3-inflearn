import { Navbar, QuickMenu, Sidebar } from "./UserComponents";

function Disaster() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Disaster Lab: 중복 요청의 재앙 🧪</h1>
      <p>동일한 유저 정보를 3개의 컴포넌트가 각자 가져옵니다.</p>
      <hr />
      <Navbar />
      <div style={{ display: "flex", height: "200px", marginTop: "10px" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "10px" }}>
          본문 콘텐츠 영역입니다.
        </main>
      </div>
      <QuickMenu />
    </div>
  );
}

export default Disaster;
