import { isValidConfig } from "../utils/systemGuard";

function BootCamp({ rawConfig }: { rawConfig: unknown }) {
  if (!isValidConfig(rawConfig)) {
    return (
      <div
        style={{ color: "orange", padding: "20px", border: "1px solid orange" }}
      >
        ⚠️ 설정 데이터 규격이 맞지 않아 시스템을 시작할 수 없습니다.
      </div>
    );
  }
  return (
    <section
      style={{ padding: "20px", background: "#f0f4f8", borderRadius: "8px" }}
    >
      <h1>시스템 모드: {rawConfig.mode.toUpperCase()}</h1>
      <p>
        현재 버전: <strong>{rawConfig.version}</strong>
      </p>
    </section>
  );
}

export default BootCamp;
