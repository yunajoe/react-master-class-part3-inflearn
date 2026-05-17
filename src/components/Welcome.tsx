interface WelcomeProps {
  name: string;
  age: number;
  isVIP?: boolean;
}

function Welcome({ name, age, isVIP }: WelcomeProps) {
  return (
    <div
      style={{
        border: isVIP ? "3px solid gold" : "1px solid #ddd",
        padding: "1.5rem",
        borderRadius: "10px",
        margin: "10px 0",
      }}
    >
      <h2 style={{ margin: 0 }}>
        {name}님, {age}살이 되신 것을 축하합니다! {isVIP && "👑"}
      </h2>
      {isVIP && (
        <p style={{ color: "gold", fontWeight: "bold" }}>
          VIP 전용 프리미엄 서비스를 이용하실 수 있습니다.
        </p>
      )}
    </div>
  );
}

export default Welcome;
