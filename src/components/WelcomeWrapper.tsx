import CustomButton from "./CustomButton";
import InputField from "./inputField";
import StatusDisplay from "./StatusDisplay";
import Welcome from "./Welcome";

function WelcomeWrapper() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <header>
        <h1 style={{ textAlign: "center", color: "#2c3e50" }}>
          04강. 타입스크립트 실전 이름표
        </h1>
      </header>
      <hr style={{ opacity: 0.1, margin: "30px 0" }} />

      <section>
        <h3>1. 기초 타입 이름표 붙이기</h3>
        <Welcome name="React with TypeScript" age={25} isVIP={true} />
      </section>

      <section style={{ marginTop: "40px" }}>
        <h3>2. 정밀한 상태 설계 (Status)</h3>
        <StatusDisplay
          status={{ state: "success", data: "서버 데이터 로드 완료!" }}
        />
      </section>

      <section style={{ marginTop: "40px" }}>
        <h3>3. 이벤트와 커스텀 컴포넌트</h3>
        <InputField />
        <CustomButton
          customColor="primary"
          onClick={() => alert("설계도가 완벽합니다!")}
        >
          시스템 가동 시작
        </CustomButton>
      </section>
    </div>
  );
}

export default WelcomeWrapper;
