import { useId } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

interface FormFieldProps {
  label: string;
  name: string;
  children: (id: string, errorId: string) => React.ReactNode;
}

function FormFiled({ label, name, children }: FormFieldProps) {
  const {
    formState: { errors },
  } = useFormContext();
  const baseId = useId();
  const errorId = `${baseId}-error`;
  const error = errors[name];
  return (
    <div>
      <label
        htmlFor={baseId}
        className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 transition-colors group-focus-within:text-indigo-500"
      >
        {label}
      </label>
      {children(baseId, errorId)}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-bold text-rose-500 mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1"
        >
          {error.message as string}
        </p>
      )}
    </div>
  );
}

function PremiumAccessibleForm() {
  const methods = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = (data: any) => console.log("data", data);
  return (
    <div>
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
          Secure Access
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          모두를 위한 평등한 디지털 경험
        </p>
      </header>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <FormFiled name="email" label="Email Identity">
            {(id, errorId) => (
              <input
                id={id}
                {...methods.register("email", {
                  required: "이메일은 필수 입력 항목입니다.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "올바른 이메일 형식이 아닙니다.",
                  },
                })}
                aria-invalid={methods.formState.errors.email ? "true" : "false"}
                aria-describedby={
                  methods.formState.errors.email ? errorId : undefined
                }
                className="w-full p-4 bg-slate-100/50 border-2 border-transparent rounded-2xl outline-none transition-all duration-300
                  focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]
                  aria-[invalid=true]:border-rose-500 aria-[invalid=true]:bg-rose-50/50 aria-[invalid=true]:focus:shadow-[0_0_0_4px_rgba(244,63,94,0.1)]"
                placeholder="name@company.com"
              />
            )}
          </FormFiled>
        </form>
      </FormProvider>
    </div>
  );
}

export default PremiumAccessibleForm;
