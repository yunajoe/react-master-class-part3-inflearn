import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";

interface CareerForm {
  careers: { company: string; period: string }[];
}
function SmartDynamicForm() {
  const { register, control, handleSubmit } = useForm<CareerForm>({
    defaultValues: { careers: [{ company: "", period: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "careers",
  });

  const onSubmit: SubmitHandler<CareerForm> = (data) => {
    console.log("최종 데이터", data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        동적 경력 사항 시스템
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
        {fields.map((field, index) => {
          console.log("fff", field);
          return (
            <div
              key={field.id}
              className="flex items-center gap-4 p-5 border rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex-1 flex flex-col gap-1">
                <input
                  {...register(`careers.${index}.company` as const)}
                  placeholder="회사명"
                  className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <input
                  {...register(`careers.${index}.period` as const)}
                  placeholder="근무 기간"
                  className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                type="button"
                onClick={() => remove(index)}
              >
                삭제
              </button>
            </div>
          );
        })}

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => append({ company: "", period: "" })}
            className="flex-1 py-3 border-2 border-blue-500 text-blue-500 rounded-xl font-bold hover:bg-blue-50"
          >
            + 항목 추가
          </button>
        </div>
        <button
          type="submit"
          className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-200"
        >
          데이터 서버 전송
        </button>
      </form>
    </div>
  );
}

export default SmartDynamicForm;
