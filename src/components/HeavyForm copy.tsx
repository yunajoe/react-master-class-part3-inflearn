/* [File Path]: src/components/SmartForm.tsx */
// SubmitHandler는 '값'이 아니라 '타입'이므로 'type' 키워드를 붙여 수입합니다.
import { useForm, type SubmitHandler } from "react-hook-form";

// 1. [TypeScript] 폼 데이터의 설계도를 정의합니다.
interface FormInputs {
  firstName: string;
  email: string;
  age: number;
}

export default function SmartForm() {
  // 2. [useForm] RHF 엔진 가동
  // 제네릭 <FormInputs>를 통해 필드 이름 오타를 방지합니다.
  const { register, handleSubmit } = useForm<FormInputs>();

  // 3. [SubmitHandler] 데이터 수신 핸들러
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    // 수동으로 DOM을 뒤질 필요 없이 완성된 객체를 즉시 받습니다.
    console.log("최종 데이터:", data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>React Hook Form: 제로-렉 시스템</h1>

      {/* 4. [handleSubmit] 고차 함수 
          기본 이벤트를 막고, 검증 성공 시에만 onSubmit을 실행합니다. */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        {/* register가 내부적으로 ref와 이벤트를 자동으로 꽂아줍니다. */}
        {/* // <input name={name} onChange={onChange} onBlur={onBlur} ref={ref} />
         */}
        <input {...register("firstName")} placeholder="성함" />
        <input {...register("email")} placeholder="이메일" />
        <input type="number" {...register("age")} placeholder="나이" />

        <button type="submit">데이터 제출</button>
      </form>
    </div>
  );
}
