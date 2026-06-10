import { useEffect, useState } from "react";

function MessyValidationForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // 1. [Pain] 사용자의 입력값이 바뀔 때마다 실행되는 감시자 로직
  useEffect(() => {
    // 2. [Pain] 가독성을 파괴하는 주범인 정규표현식
    // 이 암호 같은 코드가 이메일 형식을 체크한다는 것을 한눈에 알기 어렵습니다.
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$/;

    if (email.length > 0 && !emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
    } else {
      setEmailError("");
    }
  }, [email]);
  return (
    <div>
      <h3>수동 검증 시스템 (Messy)</h3>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력하세요"
        style={{ padding: "8px", width: "250px" }}
      />

      {emailError && (
        <p style={{ color: "red", fontSize: "12px" }}>{emailError}</p>
      )}
    </div>
  );
}

export default MessyValidationForm;
