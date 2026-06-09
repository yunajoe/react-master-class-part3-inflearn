import { useState } from "react";

function HeavyForm() {
  const [formData, setFormData] = useState<Record<string, string>>(
    Object.fromEntries(
      Array.from({ length: 100 }, (_, i) => [`field_${i}`, ""]),
    ),
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // ⚠️ 성능 저하의 주범: 전개 연산자(...prev)
    // 글자 하나를 칠 때마다 기존 100개의 데이터를 복사하여 새로운 객체를 만듭니다.
    // 100번의 복사 + 100개의 필드 렌더링 검사가 매 타이핑마다 발생합니다.
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div>
      <h1>🚫 제어 컴포넌트 성능 지연 테스트</h1>
      <p>
        아래 인풋에 빠르게 타이핑해 보세요. 글자가 입력을 따라오지 못하는
        'Lag'가 느껴지나요?
      </p>
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
        }}
      >
        {Object.keys(formData).map((key) => (
          <div>
            <label style={{ fontSize: "10px", color: "#666" }}>{key}</label>
            <input
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder="입력 시 지연 발생"
              style={{ padding: "5px" }}
            />
          </div>
        ))}
      </form>
    </div>
  );
}

export default HeavyForm;
