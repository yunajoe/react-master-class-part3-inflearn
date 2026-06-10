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
          />
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
          />
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
          />
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
