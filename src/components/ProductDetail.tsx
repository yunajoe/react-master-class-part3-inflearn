interface Product {
  id: string;
  name: string;
  price: number;
  adminNote: string; // 노출 금지: 관리자 메모
  secretToken: string; // 노출 금지: 내부 인증 토큰
}

type UserViewProduct = Omit<Product, "adminNote" | "secretToken">;

function ProductDetail({ product }: { product: UserViewProduct }) {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #eee",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h3>📦 상품 정보</h3>
      <p>
        상품명: <strong>{product.name}</strong>
      </p>
      <p>판매가: {product.price.toLocaleString()}원</p>
    </div>
  );
}

export default ProductDetail;
