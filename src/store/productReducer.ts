import type { ProductAction, ProductState } from "../types/product";

export function productReducer(state: ProductState, action: ProductAction) {
  switch (action.type) {
    case "SET_PRODUCT": {
      return {
        ...state,
        productId: action.payload,
      };
    }
    case "UPDATE_PRICE": {
      return {
        ...state,
        price: action.payload,
      };
    }
    default:
      return state;
  }
}
