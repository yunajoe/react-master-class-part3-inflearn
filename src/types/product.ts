export interface ProductState {
  productId: number;
  price: number;
}

export type ProductAction =
  | { type: "SET_PRODUCT"; payload: number }
  | { type: "UPDATE_PRICE"; payload: number };
