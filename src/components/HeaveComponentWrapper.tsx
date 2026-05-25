import { useState } from "react";

function HeavyComponent({ count }: { count: number }) {
  // 이 로그가 언제 찍히는지 관찰하는 것이 핵심입니다.
  console.log(`🔴 HeavyComponent 리렌더링됨! (Count: ${count})`);

  return (
    <div
      style={{
        border: "4px solid #ff6b6b",
        padding: "20px",
        marginTop: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff0f0",
      }}
    >
      <h3>🔥 Heavy Component</h3>
      <p>
        부모로부터 받은 Count: <strong>{count}</strong>
      </p>
      <p style={{ fontSize: "0.9rem", color: "#666" }}>
        (F12 개발자 도구의 콘솔(Console) 탭을 확인하세요.)
      </p>
    </div>
  );
}

function HeavyComponentWrapper() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  return (
    <div>
      <h1>⚡ React Compiler 테스트</h1>
      <p>
        이 프로젝트는 React Compiler가 자동으로 최적화를 수행하는지 확인합니다.
      </p>
      <div>
        <h3>🧪 테스트 1: Input 타이핑 (독립적인 상태 변경)</h3>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="여기에 타이핑하세요..."
          style={{
            padding: "10px",
            width: "100%",
            boxSizing: "border-box",
            fontSize: "1rem",
          }}
        />
        <p>입력된 텍스트: {text}</p>{" "}
        <ul
          style={{
            background: "#e9ecef",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          <li>
            ✅ <strong>로그가 안 찍힘:</strong> 컴파일러 성공! (text 변경이
            count에 의존하는 HeavyComponent에 영향을 주지 않음)
          </li>
          <li>
            ❌ <strong>로그가 찍힘:</strong> 컴파일러 실패 (부모가 리렌더링 되니
            자식도 따라서 리렌더링 됨)
          </li>
        </ul>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h3>🧪 테스트 2: Count 증가 (관련된 상태 변경)</h3>
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: "10px 20px",
            fontSize: "1.2rem",
            cursor: "pointer",
            background: "#4dabf7",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Count 증가시키기 (+1)
        </button>
        <p>
          이 버튼을 누르면 HeavyComponent가 리렌더링 되어야 정상입니다.
          <br />
          (props인 count가 바뀌었으니까요!)
        </p>
      </div>
      <HeavyComponent count={count} />
    </div>
  );
}

export default HeavyComponentWrapper;
