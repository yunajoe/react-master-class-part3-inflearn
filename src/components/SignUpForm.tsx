import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { signupSchema, type SignupInput } from "../schema/authSchema";

function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<SignupInput> = (data) => {
    console.log("🚀 검증 통과! 정제된 데이터:", data);
  };

  return (
    <div>
      <h1> SignUpForm</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input {...register("email")} placeholder="example@mail.com" />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="********"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
      </form>
    </div>
  );
}

export default SignUpForm;
