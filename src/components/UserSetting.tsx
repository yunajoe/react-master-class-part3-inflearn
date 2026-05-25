import { useId, useRef, useState } from "react";
import { isUserProfile } from "../utils/userGuard";

function UserSetting() {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("대기 중");

  const handleVerify = () => {
    const inputValue = inputRef.current?.value || "";
    const rawData: unknown = {
      id: "manual-id-123",
      nickname: inputValue,
    };

    if (isUserProfile(rawData)) {
      setStatus(`✅ 승인됨: ${rawData.nickname}님 환영합니다.`);
      if (inputRef.current) inputRef.current.style.border = "2px solid blue";
    } else {
      setStatus("❌ 차단됨: 닉네임 규격(문자열, 2자 이상)이 맞지 않습니다.");
      if (inputRef.current) {
        inputRef.current.style.border = "2px solid red";
        inputRef.current.focus();
      }
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "12px",
      }}
    >
      <label htmlFor={generatedId}>검증할 닉네임을 입력하세요 (2자 이상)</label>
      <input
        id={generatedId}
        ref={inputRef}
        type="text"
        placeholder="예: 아키텍트"
        style={{
          padding: "8px",
          marginBottom: "10px",
          width: "200px",
          border: "5px solid black",
        }}
      />
      <button
        onClick={handleVerify}
        style={{
          marginLeft: "10px",
          padding: "8px 16px",
          cursor: "pointer",
          border: "5px solid blue",
        }}
      >
        실시간 검증 실행
      </button>
      <p style={{ marginTop: "15px", fontWeight: "bold" }}>상태: {status}</p>
    </div>
  );
}

export default UserSetting;
