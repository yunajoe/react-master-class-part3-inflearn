import { useZooStore } from "../store/useZoostore";

function BearCounter() {
  const bears = useZooStore((state) => state.bears);
  const addBear = useZooStore((state) => state.addBear);
  console.log("🐻 곰 컴포넌트가 다시 그려집니다!");

  return (
    <div
      style={{
        border: "2px solid brown",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h2>곰 우리</h2>
      <p>
        현재 곰: <strong>{bears}</strong>마리
      </p>
      <button onClick={addBear}>곰 추가</button>
    </div>
  );
}

export default BearCounter;
