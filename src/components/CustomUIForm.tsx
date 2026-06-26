import { Controller, useForm } from "react-hook-form";

function CustomUIForm() {
  const { control } = useForm({
    defaultValues: { pushNotification: false },
  });
  return (
    <form
      className="p-10 bg-slate-50 min-h-[300px] rounded-2xl border border-slate-200"
      onSubmit={(data) => {
        console.log("제출됨", data);
      }}
    >
      <Controller
        name="pushNotification"
        control={control}
        render={(result) => {
          const { field, fieldState } = result;
          return (
            <div>
              <div>
                <span className="text-sm font-semibold text-slate-700">
                  푸시 알림 수신 설정
                </span>
                {/*  실제 스위치 구현부: 비표준 태그인 button 사용  
                 - button이 비표준인 이유: 웹 표준(Web Standards)과 접근성(Accessibility) 관점에서 HTML의 <button> 태그는 원래 '클릭하여 특정 동작을 실행하는 요소'로 정의되어 있음.
                 - 폼(Form) 안에서 사용자가 ON/OFF 상태를 선택하고 그 값을 서버로 전송하는 ‘입력 UI’를 만들 때는 표준적으로 <input type="checkbox">나 <input type="radio">를 사용
                
                */}
                <button
                  type="button"
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onClick={() => field.onChange(!field.value)}
                  className={`${field.value ? "bg-indigo-600" : "bg-slate-200"}
                  relative inline-flex h-7 w-12 items-center rounded-full transition-all
                  outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2`}
                >
                  <span
                    className={`${field.value ? "translate-x-6" : "translate-x-1"}
                  inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md`}
                  />
                </button>
              </div>
              {fieldState.error && (
                <span className="text-xs text-rose-500 ml-1">
                  {fieldState.error.message}
                </span>
              )}
            </div>
          );
        }}
      />
      <button
        type="submit"
        className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-200"
      >
        설정 저장하기
      </button>
    </form>
  );
}

export default CustomUIForm;
