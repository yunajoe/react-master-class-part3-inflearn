import { GlobalErrorBoundary } from "./GlobalError";

function Bomb() {
  throw new Error("💥 엔진 임계점 도달! 냉각 장치 가동 필요");
  return <div>BOMB!</div>;
}

function BombWrapper() {
  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>12강. 에러 바운더리 & 클래스 컴포넌트 실습</h1>
      <p>훅이 주류인 시대에도 클래스 기반 인프라는 앱을 지탱하는 핵심입니다.</p>
      <hr style={{ margin: "30px 0", opacity: 0.1 }} />

      <GlobalErrorBoundary
        fallback={
          <button
            style={{ padding: "10px 20px", cursor: "pointer" }}
            onClick={() => window.location.reload()}
          >
            시스템 재시작
          </button>
        }
      >
        <section>
          <h3>🛡️ 안전 보호 구역 내부</h3>
          <Bomb />
        </section>
      </GlobalErrorBoundary>
    </div>
  );
}

export default BombWrapper;
