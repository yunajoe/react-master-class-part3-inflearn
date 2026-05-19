import type { User } from "../types/user";
import DataList from "./DataList";

interface Product {
  id: string;
  title: string;
  price: number;
}
function DataListWrapper() {
  const users: User[] = [
    { id: 1, displayName: "Alice" },
    { id: 2, displayName: "Bob" },
  ];

  const products: Product[] = [
    { id: "p1", title: "TypeScript 장인 키보드", price: 150000 },
    { id: "p2", title: "아키텍트 설계 마우스", price: 89000 },
  ];
  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
      }}
    >
      <h1>05강. 제네릭 실습: 마법의 거푸집</h1>
      <p>extends 제약을 통해 안전하게 추상화된 컴포넌트입니다.</p>
      <hr style={{ margin: "30px 0", opacity: 0.2 }} />

      <section>
        <h2>👥 사용자 목록 (User 타입 주입)</h2>
        <DataList<User>
          items={users}
          renderRow={(user) => (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{user.displayName}</strong>
              <span style={{ color: "#646cff" }}>ID: {user.id}</span>
            </div>
          )}
        />
      </section>

      <section style={{ marginTop: "50px" }}>
        <h2>📦 상품 목록 (Product 타입 주입)</h2>
        <DataList<Product>
          items={products}
          renderRow={(product) => (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{product.title}</span>
              <strong style={{ color: "#2ecc71" }}>
                {product.price.toLocaleString()}원
              </strong>
            </div>
          )}
        />
      </section>
    </div>
  );
}

export default DataListWrapper;
