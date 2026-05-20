import PrimaryButton from "./PrimaryButton";
import ProductDetail from "./ProductDetail";
import ProfileEditor from "./ProfileEditor";

function ProfileEditorContainer() {
  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>08강. 인터페이스 확장 및 유틸리티 실습</h1>
      <hr style={{ opacity: 0.1, margin: "30px 0" }} />

      <section>
        <h2>1. 유전자 확장 및 표준 속성 복제 (extends)</h2>
        <PrimaryButton variant="solid" onClick={() => alert("표준 속성 작동!")}>
          상속받은 표준 버튼
        </PrimaryButton>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>2. 데이터 정밀 가공 (Omit)</h2>
        <ProductDetail
          product={{ id: "A101", name: "고급 리액트 가이드", price: 45000 }}
        />
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>3. 유연한 수정 로직 (Partial)</h2>
        <ProfileEditor />
      </section>
    </div>
  );
}

export default ProfileEditorContainer;
