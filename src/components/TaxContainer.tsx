import { useReducer } from "react";
import { productReducer } from "../store/productReducer";
import type { ProductState } from "../types/product";
import { taxCalculator } from "../utils/taxCalculator";

const initialState: ProductState = {
  productId: 101,
  price: 500000,
};
function TaxContainer() {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const trackingCode = taxCalculator(state);
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#1a73e8" }}>07강. TS 마이그레이션 솔루션</h1>
      <p>모든 엔진의 톱니바퀴가 타입 규격 아래 완벽히 정렬되었습니다.</p>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          maxWidth: "500px",
        }}
      >
        <h3 style={{ marginTop: 0 }}>📦 상품 정보 센터</h3>
        <p>
          상품 식별 번호: <strong>{state.productId}</strong>
        </p>
        <p>
          현재 설정 가격: <strong>{state.price.toLocaleString()}원</strong>
        </p>
        <hr style={{ opacity: 0.2 }} />
        <h4 style={{ color: "#34a853" }}>🛡️ 보안 세금 엔진 가동 중</h4>
        <p>
          검증된 추적 코드:
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {trackingCode}
          </span>
        </p>
        <button
          onClick={() => dispatch({ type: "UPDATE_PRICE", payload: 65000 })}
          style={{
            backgroundColor: "#1a73e8",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          가격 업데이트 (계약 준수)
        </button>
      </div>
    </div>
  );
}

export default TaxContainer;
