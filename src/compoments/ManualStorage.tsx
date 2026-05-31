import { useEffect, useState } from "react";

function ManualStorage() {
  // 지연 초기화: useState의 초기값으로 값 대신 함수를 넘겨주는 기법
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("my-cart");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("데이터 복구 중 오류 발생:", error);
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("my-cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: string) => setCart([...cart, item]);

  return (
    <div
      style={{
        padding: "20px",
        border: "2px dashed red",
        borderRadius: "12px",
      }}
    >
      <h2>🛒 장바구니 (수동 관리 중)</h2>
      <p>
        담긴 물건: <strong>{cart.join(", ") || "비어 있음"}</strong>
      </p>
      <button
        onClick={() => addItem("사과")}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        사과 추가
      </button>
      <p style={{ fontSize: "0.8rem", color: "gray", marginTop: "10px" }}>
        ※ 새로고침해도 유지되지만, 비즈니스 로직보다 저장 로직이 더 깁니다.
      </p>
    </div>
  );
}

export default ManualStorage;
