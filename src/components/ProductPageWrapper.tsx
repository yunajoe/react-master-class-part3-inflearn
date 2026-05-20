import ProductPage from "./ProductPage";

function ProductPageWrapper() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "50px",
        fontFamily: "sans-serif",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#2c3e50" }}>10강. 스키마 기반 방어 아키텍처</h1>
        <p>외부의 변화로부터 우리 앱을 지키는 정밀 검열 시스템</p>
      </header>
      <hr style={{ opacity: 0.1, margin: "30px 0" }} />
      <main>
        {/* 101번 상품을 호출하여 방어 로직을 가동합니다. */}
        <ProductPage productId={101} />
      </main>
    </div>
  );
}

export default ProductPageWrapper;
