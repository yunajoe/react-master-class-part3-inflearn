import { useZooStore } from "../store/useZoostore";

export function FishCounter() {
  /**
   * [핵심]: 물고기 전용 주파수 구독
   * bears의 변화는 무시하고 오직 fish의 변화에만 귀를 기울입니다.
   */

  // 불필요한 렌더링이 발생되는지 확인하기 위해 고의로 통째로 가져와봄
  const store = useZooStore();

  const addFish = useZooStore((state) => state.addFish);

  console.log("🐟 물고기 컴포넌트가 다시 그려집니다!");

  return (
    <div
      style={{
        border: "2px solid blue",
        padding: "20px",
        marginTop: "20px",
        borderRadius: "10px",
      }}
    >
      <h2>물고기 연못</h2>
      <p>
        현재 물고기: <strong>{store.fish}</strong>마리
      </p>
      <button onClick={addFish}>물고기 추가</button>
    </div>
  );
}
