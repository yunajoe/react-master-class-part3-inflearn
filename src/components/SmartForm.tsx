import { useForm, type SubmitHandler } from "react-hook-form";

interface FormInputs {
  firstName: string;
  email: string;
  age: number;
}

function SmartForm() {
  const { register, handleSubmit } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log("최종 데이터:", data);
  };

  return (
    <div>
      <h1>React Hook Form: 제로-렉 시스템</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {/*  register가 내부적으로 ref와 이벤트를 자동으로 꽂아줍니다. */}
        {/*  <input name={name} onChange={onChange} onBlur={onBlur} ref={ref} />
         */}
        <input {...register("firstName")} placeholder="성함" />
        <input {...register("email")} placeholder="이메일" />
        <input type="number" {...register("age")} placeholder="나이" />
        <button type="submit">데이터 제출</button>
      </form>
    </div>
  );
}

export default SmartForm;
