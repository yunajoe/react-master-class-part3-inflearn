import { useEffect, useState } from "react";

interface ProductDetail {
  id: number;
  title: string;
  price: number;
}

function validateProduct(data: any): data is ProductDetail {
  return (
    data &&
    typeof data.id === "number" &&
    typeof data.title === "string" &&
    typeof data.price === "number"
  );
}

function ProductPage({ productId }: { productId: number }) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (validateProduct(data)) {
        } else {
          console.error(
            "🚨 [규격 불일치]: 서버가 약속을 어긴 데이터가 감지되었습니다.",
          );
          setError("시스템 규격에 맞지 않는 데이터입니다.");
        }
      })
      .catch(() => setError("네트워크 통신 중 오류가 발생했습니다."));
  }, [productId]);

  if (error)
    return (
      <div style={{ color: "red", padding: "20px", border: "1px solid red" }}>
        {error}
      </div>
    );

  if (!product) return <div>데이터를 정밀 검사하는 중입니다...</div>;
  return (
    <div
      className="product-container"
      style={{ padding: "20px", border: "1px solid #646cff" }}
    >
      <h1>{product.title}</h1>
      <p style={{ fontSize: "1.2rem" }}>
        가격: {product.price.toLocaleString()}원
      </p>
    </div>
  );
}

export default ProductPage;
