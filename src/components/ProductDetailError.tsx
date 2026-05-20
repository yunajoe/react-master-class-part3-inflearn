import { useEffect, useState } from "react";

// 1. 우리가 서버와 맺은 '취약한' 데이터 계약
interface ProductDetail {
  id: number;
  title: string;
  price: number;
}

function ProductDetailError({ productId }: { productId: number }) {
  const [product, setProduct] = useState<ProductDetail | null>(null);

  useEffect(() => {
    const simulateFetch = async () => {
      const responseFromServer = {
        id: productId,
        title: "고난의 타입스크립트 키보드",
        amount: 89000,
      };
      setProduct(responseFromServer as any as ProductDetail);
    };
    simulateFetch();
  }, [productId]);

  if (!product) return <div>상품 정보를 불러오는 중입니다...</div>;

  return (
    <div style={{ padding: "20px", border: "2px dashed red" }}>
      <h1>{product.title}</h1>
      <p style={{ fontSize: "1.5rem", color: "red" }}>
        가격: {product.price.toLocaleString()}원
      </p>
    </div>
  );
}

export default ProductDetailError;
