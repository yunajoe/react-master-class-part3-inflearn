import ProductDetailError from "./ProductDetailError";

function ProductDetailErrorWrapper() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "50px",
        textAlign: "center",
      }}
    >
      <header>
        <h1 style={{ color: "#2c3e50" }}>09강. API 명세 변경의 비극</h1>
        <p style={{ color: "#7f8c8d" }}>
          서버가 약속을 어기면 어떤 일이 벌어질까요?
        </p>
      </header>

      <main style={{ marginTop: "30px" }}>
        {/* 고장 난 서버 데이터를 시뮬레이션하는 페이지를 호출합니다. */}
        <ProductDetailError productId={101} />
      </main>

      <footer style={{ marginTop: "50px", fontSize: "0.8rem", color: "#ccc" }}>
        © 2026 Defensive Architecture Training
      </footer>
    </div>
  );
}

export default ProductDetailErrorWrapper;
