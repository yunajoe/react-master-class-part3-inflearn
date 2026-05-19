import type { ProductState } from "../types/product";

export function taxCalculator(state: ProductState): number {
  /**
   * 타입스크립트가 productId가 무조건 숫자임을 보장합니다.
   * 덕분에 "101" + 100 = "101100" 같은 기괴한 문자열 버그는 원천 봉쇄됩니다.
   */
  const trackingCode = state.productId + 100;

  return trackingCode;
}
