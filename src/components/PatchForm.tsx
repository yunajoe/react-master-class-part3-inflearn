import { useForm } from "react-hook-form";
export const getDirtyValues = (data: any, dirtyFields: any): any => {
  const dirtyValues: any = {};

  Object.keys(dirtyFields).forEach((key) => {
    const currentField = dirtyFields[key];

    if (
      typeof currentField === "object" &&
      currentField !== null &&
      !Array.isArray(currentField)
    ) {
      const childDirtyValues = getDirtyValues(data[key], currentField);
      if (Object.keys(childDirtyValues).length > 0) {
        dirtyValues[key] = childDirtyValues;
      }
    } else if (currentField === true) {
      dirtyValues[key] = data[key];
    }
  });

  return dirtyValues;
};
const initialData = {
  profile: { name: "홍길동", role: "Developer" },
  settings: { theme: "dark", notifications: true },
};

export default function PatchForm() {
  const {
    register,
    handleSubmit,
    formState: { dirtyFields, isDirty },
  } = useForm({
    defaultValues: initialData,
  });

  const onSubmit = (data: any) => {
    const patchData = getDirtyValues(data, dirtyFields);
    console.log("🔥 전송할 데이터 (PATCH):", patchData);
    alert("바뀐 데이터만 콘솔에 출력되었습니다.");
  };
  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Smart PATCH Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            {...register("profile.name")}
            className="w-full p-4 bg-slate-50 border rounded-2xl"
            placeholder="Name"
          />
          <input
            {...register("profile.role")}
            className="w-full p-4 bg-slate-50 border rounded-2xl"
            placeholder="Role"
          />
        </div>
        <button type="submit" disabled={!isDirty}>
          수정사항 저장 (PATCH)
        </button>
      </form>
    </div>
  );
}
