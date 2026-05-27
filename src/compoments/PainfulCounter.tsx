import { useReducer } from "react";

type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "UPDATE_MESSAGE"; payload: string };

interface State {
  count: number;
  message: string;
}

const initialState: State = { count: 0, message: "안녕하세요" };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

function PainfulCounter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div style={{ padding: "20px", border: "1px solid #ccc" }}>
      <h2>고통의 카운터</h2>
      <p>
        카운트: {state.count} | 메시지: {state.message}
      </p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>증가</button>
      <button
        onClick={() =>
          dispatch({ type: "UPDATE_MESSAGE", payload: "반가워요!" })
        }
      >
        메시지 변경
      </button>
    </div>
  );
}

export default PainfulCounter;
