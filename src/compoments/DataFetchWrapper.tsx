import { useDepartmentStore } from "../store";

function DataFetchWrapper() {
  const perfumeStock = useDepartmentStore((state) => state.perfumeStock);
  const sellPerfume = useDepartmentStore((state) => state.sellPerfume);
  const shirtStock = useDepartmentStore((state) => state.shirtStock);
  const sellShirt = useDepartmentStore((state) => state.sellShirt);

  return (
    <div
      style={{ padding: "40px", fontFamily: "sans-serif", lineHeight: "1.6" }}
    >
      <h1>🏬 Zustand 백화점 관리 시스템</h1>

      <section
        style={{
          marginBottom: "30px",
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>💄 1층: 화장품 코너</h2>
        <p>
          향수 재고: <strong>{perfumeStock}</strong>개
        </p>
        <button
          onClick={sellPerfume}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          향수 판매
        </button>
      </section>

      <section
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>👕 2층: 의류 코너</h2>
        <p>
          셔츠 재고: <strong>{shirtStock}</strong>개
        </p>
        <button
          onClick={sellShirt}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          셔츠 판매
        </button>
      </section>
    </div>
  );
}

export default DataFetchWrapper;
