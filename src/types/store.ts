/**
 * [1층 화장품 코너 설계도]
 * 향수 재고와 판매 로직을 정의합니다.
 */
export interface CosmeticsSlice {
  perfumeStock: number; // 향수 재고량 (상태)
  sellPerfume: () => void; // 향수 판매 (액션)
}

/**
 * [2층 의류 코너 설계도]
 * 셔츠 재고와 판매 로직을 정의합니다.
 */
export interface ClothingSlice {
  shirtStock: number; // 셔츠 재고량 (상태)
  sellShirt: () => void; // 셔츠 판매 (액션)
}

/**
 * [백화점 통합 설계도]
 * 1층과 2층의 기능을 합쳐 하나의 거대한 중앙 통제실 청사진을 만듭니다.
 */
export interface DepartmentStore extends CosmeticsSlice, ClothingSlice {}
