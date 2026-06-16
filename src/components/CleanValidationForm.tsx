import { useForm, type SubmitHandler } from "react-hook-form";

interface FormInputs {
  email: string;
  password: string;
  passwordConfirm: string;
}

function CleanValidationForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log("제출 성공:", data);
  };
  return (
    <div>
      <h1>Join Us</h1>
      <p>무결점 시스템으로 안전하게 시작하세요.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 이메일 섹션 */}
        <div>
          <label>Email Address</label>
          <input
            {...register("email", {
              required: "이메일을 입력해주세요.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$/,
                message: "이메일 형식이 올바르지 않습니다.",
              },
            })}
            placeholder="example@mail.com"
            style={
              errors.email ? { ...inputStyle, ...inputErrorStyle } : inputStyle
            }
          />
          {errors.email && (
            <span style={errorTextStyle}>{errors.email.message}</span>
          )}
        </div>
        {/* 비밀번호 섹션 */}
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", {
              required: "비밀번호를 입력해주세요.",
              minLength: {
                value: 8,
                message: "최소 8자 이상 입력해야 합니다.",
              },
            })}
            placeholder="8자 이상 입력"
            style={
              errors.password
                ? { ...inputStyle, ...inputErrorStyle }
                : inputStyle
            }
          />
          {errors.password && (
            <span style={errorTextStyle}>{errors.password.message}</span>
          )}
        </div>

        {/* 비밀번호 확인 섹션 */}
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("passwordConfirm", {
              required: "비밀번호 확인이 필요합니다.",
              validate: (val) =>
                val === watch("password") || "비밀번호가 일치하지 않습니다.",
            })}
            placeholder="다시 한번 입력"
            style={
              errors.passwordConfirm
                ? { ...inputStyle, ...inputErrorStyle }
                : inputStyle
            }
          />
          {errors.passwordConfirm && (
            <span style={errorTextStyle}>{errors.passwordConfirm.message}</span>
          )}
        </div>
        {errors.passwordConfirm && (
          <span>{errors.passwordConfirm.message}</span>
        )}
        <button type="submit">Get Started</button>
      </form>
    </div>
  );
}

export default CleanValidationForm;

const inputStyle: React.CSSProperties = {
  padding: "14px 18px",
  borderRadius: "14px",
  border: "1.5px solid #eee",
  fontSize: "16px",
  outline: "none",
  transition: "all 0.2s ease",
  backgroundColor: "#fbfbfb",
};

const inputErrorStyle: React.CSSProperties = {
  border: "1.5px solid #ff4d4f",
  backgroundColor: "#fff1f0",
};

const errorTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#ff4d4f",
  fontWeight: "600",
  marginLeft: "4px",
};
