import { useForm, type SubmitHandler } from "react-hook-form";

export interface UserProfileForm {
  userName: string;
  userEmail: string;
  userAge: number;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
}

function TypedForm() {
  const { register, handleSubmit } = useForm<UserProfileForm>({
    defaultValues: {
      userName: "",
      userEmail: "",
      userAge: 20,
      preferences: { theme: "light", notifications: true },
    },
    mode: "onChange",
  });

  const onSave: SubmitHandler<UserProfileForm> = (data) => {
    console.log("✅ 검증 완료된 안전한 데이터:", data);
    alert(`${data.userName}님의 설정이 저장되었습니다!`);
  };
  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}
    >
      <h2>무결점 타입 폼 시스템</h2>
      <form onSubmit={handleSubmit(onSave)}>
        <input {...register("userName")} />
        <input {...register("userEmail")} placeholder="이메일 주소" />
        <input type="number" {...register("userAge")} placeholder="나이" />

        <fieldset style={{ padding: "10px", borderRadius: "5px" }}>
          <legend>환경 설정 (중첩 구조)</legend>
          <select {...register("preferences.theme")}>
            <option value="light">라이트 모드</option>
            <option value="dark">다크 모드</option>
          </select>
          <br />
          <label>
            <input type="checkbox" {...register("preferences.notifications")} />
          </label>
        </fieldset>

        <button
          type="submit"
          style={{
            padding: "10px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
          }}
        >
          안전하게 저장하기
        </button>
      </form>
    </div>
  );
}

export default TypedForm;
