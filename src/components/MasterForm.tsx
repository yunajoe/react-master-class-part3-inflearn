import { useForm } from "react-hook-form";

interface MasterInputs {
  price: string;
  tags: string;
}

function MasterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { price: "0", tags: "" } });

  const onSubmit = async (formData: MasterInputs) => {
    const refinedData = {
      ...formData,
      price: Number(formData.price),
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
      sentAt: new Date().toISOString(),
    };
    console.log("🚀 [API 전송 데이터]:", refinedData);

    try {
      await new Promise((_, reject) =>
        setTimeout(() => ({
          response: {
            data: {
              errors: {
                tags: "서버에서 허용하지 않는 금지어 태그가 포함되어 있습니다.",
              },
            },
          },
        })),
      );
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        Object.entries(serverErrors).forEach(([key, message]) => {
          setError(key as any, { type: "server", message: message as string });
        });
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-black mb-8 text-slate-900 tracking-tighter">
        Final Masterpiece
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Price (Number)
          </label>
          <input
            {...register("price")}
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all"
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Tags (Comma separated)
          </label>
          <input
            {...register("tags")}
            className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.tags ? "border-rose-500 bg-rose-50" : "border-transparent focus:border-indigo-500"}`}
            placeholder="react, ts, rhf"
          />
          {errors.tags && (
            <p className="text-rose-500 text-xs font-bold ml-1 animate-in fade-in">
              {errors.tags.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? "정제 및 전송 중..." : "서버로 데이터 최종 발송"}
        </button>
      </form>
    </div>
  );
}

export default MasterForm;
