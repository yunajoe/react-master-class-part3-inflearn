import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

function RenderCounter({ name }: { name: string }) {
  const count = useRef(0);
  count.current++;
  return (
    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
      {name} Render: {count.current}
    </span>
  );
}

function TitleWatcher({ control }: { control: any }) {
  const title = useWatch({ control, name: "title" });

  return (
    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-indigo-700">
          useWatch (구독 중)
        </h3>
        <RenderCounter name="Child" />
      </div>
      <p className="text-indigo-900 italic">"{title || "대기 중..."}"</p>
    </div>
  );
}

interface PerformanceForm {
  title: string;
}

function PerformanceDeepDive() {
  const { register, control, getValues } = useForm<PerformanceForm>();
  return (
    <div>
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900">Performance Lab</h1>
        <RenderCounter name="Parent" />
      </header>
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 space-y-6">
        <div>
          <label className="text-xs font-black text-slate-400 uppercase">
            Input Field
          </label>
          <input
            {...register("title")}
            placeholder="입력 시 Child만 반응합니다"
            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all"
          />
        </div>

        <TitleWatcher control={control} />

        <button
          type="button"
          onClick={() => alert(`[Snapshot]: ${getValues("title")}`)}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95"
        >
          getValues 스냅샷 (부모/자식 렌더링 0회)
        </button>
      </div>
    </div>
  );
}

export default PerformanceDeepDive;
