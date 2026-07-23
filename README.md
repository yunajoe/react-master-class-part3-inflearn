### 45강: useFieldArray: 고유 ID 기반의 리스트 관리로 성능과 데이터 일관성을 동시에 잡는 기술

1.  useFieldArray를 사용해야 하는가?

- 데이터 무결성: RHF 내부 저장소와 UI 상태를 완벽하게 동기화합니다. "지웠는데 남아있는" 현상이 사라집니다.
- 고유 ID (field.id) 생성: 리액트에서 가장 골치 아픈 '인덱스를 키로 사용할 때 발생하는 버그'를 원천 차단합니다.
- 성능 최적화: 배열 전체를 리렌더링하지 않고, 추가/삭제/수정된 특정 항목만 정밀하게 업데이트합니다.
- 복합 로직 지원: 단순 추가/삭제를 넘어 순서 변경(move), 특정 위치 삽입(insert) 등을 메서드 하나로 해결합니다.

2.  useFieldArray 조작 도구 모음 리스트

- append(obj): 리스트의 끝에 새로운 항목을 추가합니다. (가장 흔함)
- prepend(obj): 리스트의 맨 앞에 추가합니다. (최신순 정렬 시 유용)
- remove(index): 특정 순서의 항목을 삭제합니다. 연결된 유효성 검사와 에러 메시지도 함께 삭제됩니다.
- move(from, to): 항목의 순서를 바꿉니다. 드래그 앤 드롭 구현 시 필수입니다.
- insert(index, obj): 특정 중간 위치에 항목을 끼워 넣습니다.
- replace(arr): 전체 리스트를 새로운 배열로 통째로 교체합니다.

### 46강. 성능 최적화 디테일: useWatch(구독) vs getValues(일회성)

1. useWatch

- 우리는 종종 비밀번호를 입력할 때 실시간으로 강도를 표시하거나, 체크박스를 눌렀을 때만 추가 입력창을 보여주는 기능을 구현해야 합니다. 이때 리액트의 일반적인 상태인 useState를 쓰면 글자 하나를 칠 때마다 폼 전체가 리렌더링되는 비극이 발생하지만, useWatch는 구독 기반의 도구로서 이 문제를 해결해 줍니다.
- useWatch는 내부적으로 구독(Subscription) 모델을 사용합니다. 전체 폼 상태가 변해도, 내가 지정한 name의 값이 변하지 않았다면 리액트에게 렌더링 신호를 보내지 않습니다.

2. watch vs useWatch

- watch 함수: 단지 내 특정 집에 택배가 왔다는 사실을 아파트 전체 스피커로 방송하는 것과 같습니다. 택배와 상관없는 옆집 사람들도 하던 일을 멈추고 방송을 들어야 하죠(컴포넌트 전체 리렌더링).
- useWatch 훅: 해당 세대에만 설치된 전용 인터폰으로 호출하는 방식입니다. 오직 택배를 기다리던 그 집만 반응하고 다른 이웃들은 평온을 유지합니다(특정 하위 컴포넌트만 리렌더링).

3. getValues

- 반면 단순히 값을 읽어오기만 하면 되고 화면을 다시 그릴 필요가 없는 순간도 있습니다. 예를 들어 제출 버튼을 눌렀을 때 현재 값을 확인하거나 로직 계산을 위해 잠깐 값을 참조할 때입니다. 이럴 때 필요한 도구가 바로 렌더링을 깨우지 않는 조용한 스냅샷인 getValues

- getValues는 구독이 아니라 일회성 폴라로이드 사진입니다. 호출하는 순간의 데이터 저장소 상태를 찍어서 가져올 뿐 리액트의 렌더링 사이클을 전혀 건드리지 않습니다.

4.  useWatch vs getValues 핵심 비교

- useWatch (실시간 구독 모드)
  주 목적: 실시간 UI 피드백 (비밀번호 강도, 조건부 필드 노출 등).
  렌더링 수치:해당 하위 컴포넌트만 N회 발생 (부모는 0회).
  특징: 데이터 변화를 감지하여 스트리밍 방식으로 화면을 갱신함.
- getValues (조용한 스냅샷 모드)
  주 목적: 로직 연산 및 데이터 참조 (제출 전 가공, 로그 기록 등).
  렌더링 수치:전체 컴포넌트 0회 발생.
  특징: 리액트 사이클을 거치지 않고 메모리 저장소에서 즉시 값을 탈취함.

### 48강. 데이터 유지 전략: React Hook Form 다단계 폼 영속성(Persistence) 아키텍처

1. 문제 해결 핵심: shouldUnregister: false

- 문제: 리액트의 기본 생리상 컴포넌트가 언마운트(Unmount)되면 인풋 데이터가 화면에서 사라지며 유실됨.

- 해결: RHF 옵션 중 shouldUnregister: false를 설정하면 DOM에서 인풋이 제거되어도 내부 메모리 스토어(Internal Store)에 입력값이 그대로 유지됨.

2.  아키텍처 핵심 컴포넌트
    | 구분 | 역할 | 동작 원리 |
    | :---------------------------------- | :-------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
    | **FormProvider**<br>(중앙 방송국) | `useForm`의 모든 도구(`register`, `handleSubmit` 등)를 하위 컴포넌트로 전파 | 내부적으로 React Context API를 활용하여 하위 트리에 폼 상태를 실시간 공급 |
    | **useFormContext**<br>(전용 수신기) | 부모가 제공하는 폼 엔진에 직접 접속하여 필요한 도구를 추출 | **Prop Drilling 해결**: 중간 컴포넌트를 거치지 않고 부모 폼 상태에 직접 접근 |

3.  주요 코드 구현 패턴

- 메인 엔진 설정 (부모: MultiStepForm.tsx)

```javascript
import { useForm, FormProvider } from "react-hook-form";

export default function MultiStepForm() {
  const methods = useForm({
    shouldUnregister: false, // 💡 핵심: 언마운트 시 데이터 삭제 방지 (영속성)
    mode: "onChange", // 실시간 유효성 검증
    defaultValues: {
      step1: { email: "", name: "" },
      step2: { address: "", phone: "" },
      step3: { agreement: false },
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data) =>
          console.log("최종 데이터:", data),
        )}
      >
        <CurrentStepComponent />
      </form>
    </FormProvider>
  );
}
```

- 자식 컴포넌트 접속 (자식: Step1Component.tsx)

```javascript
import { useFormContext } from "react-hook-form";

function Step1Component() {
  // Prop Drilling 없이 부모의 폼 엔진 접속
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">Step 1: 기본 정보</h2>

      {/* 객체 경로 기반 타겟팅 */}
      <input
        {...register("step1.email", { required: "이메일은 필수입니다." })}
        placeholder="이메일 주소"
        className="border-2 p-3 w-full rounded-md"
      />
      {errors.step1?.email && (
        <p className="text-red-500 text-xs">{errors.step1.email.message}</p>
      )}
    </div>
  );
}
```

4. 수동 백업 vs shouldUnregister

| 비교 항목          | 수동 백업 (Zustand/Context 등)                               | shouldUnregister: false (RHF 추천)                    |
| :----------------- | :----------------------------------------------------------- | :---------------------------------------------------- |
| **코드 복잡도**    | 단계 이동 시마다 `save` 함수 호출 및 전역 상태 동기화 필요   | **설정 한 줄로 자동화**                               |
| **메타 상태 보존** | 에러 메시지(`errors`), 입력 여부(`isDirty`) 수동 백업 어려움 | 데이터뿐만 아니라 **에러/메타 상태까지 자동 보존**    |
| **데이터 무결성**  | 전역 상태와 폼 엔진 상태 불일치 버그 위험 존재               | **단일 저장소(Single Source of Truth)**로 무결성 보장 |

### 50강. setError 활용 전략 & 서버 에러 실시간 동기화

1. 핵심 개요 (Overview)
   목적: 서버 API에서 반환된 유효성 검사 에러를 수동으로 일일이 매핑하지 않고, RHF 폼 엔진에 자동으로 동기화하여 처리.

핵심 이점: 단일 진실 공급원(Single Source of Truth) 원칙에 따라 UI는 에러 메시지를 판단하지 않고 전달받아 노출만 함 (서버 문구가 바뀌어도 프론트 수정 불필요).

2. setError 기본 구문 (Basic Syntax)
   특정 필드에 수동 또는 서버 에러 상태를 직접 주입하는 RHF 제공 메서드입니다.

```javascript
setError("email", {
  type: "server", // 에러 유형 ("server" | "manual" 등)
  message: "이미 사용 중인 이메일입니다.", // 화면에 출력될 메시지 (errors.email.message)
});
```

```
name: 에러를 표시할 input 필드 이름
type: 에러 성격 명시 (클라이언트 유효성 검사가 아닌 서버 응답의 경우 보통 "server" 사용)
message: errors[name].message 형태로 UI에 렌더링될 텍스트
```

3. 서버 에러 자동 매핑 패턴 (Object.entries)
   서버에서 객체 형태({ fieldName: errorMessage })로 전달되는 에러 응답을 순회하며 한 번에 매핑합니다.

```javascript
const onSubmit = async (data: LoginFormInputs) => {
  try {
    await loginApi(data);
    alert("로그인 성공!");
  } catch (error: any) {
    const serverErrors = error.response?.data?.errors;

    if (serverErrors) {
      Object.entries(serverErrors).forEach(([key, message]) => {
        setError(key as keyof LoginFormInputs, {
          type: "server",
          message: message as string
        });
      });
    }
  }
};
```

4. UX 최적화: 스마트 에러 해제 (Smart Clearing)

- reValidateMode: "onChange" 옵션을 설정하면, 사용자가 에러가 난 필드를 다시 수정(타이핑)하기 시작할 때 기존에 주입된 서버 에러가 자동으로 사라져 자연스러운 UX를 제공합니다.

```javascript
const methods =
  useForm <
  LoginFormInputs >
  {
    reValidateMode: "onChange", // 💡 입력 수정 시 기존 에러 자동 해제
  };
```

| 구분                           | 주요 역할 / 설정                | 효과                                             |
| :----------------------------- | :------------------------------ | :----------------------------------------------- |
| **setError**                   | 특정 필드에 에러 상태 직접 주입 | 서버 응답을 RHF 내부 에러 상태로 매핑            |
| **Object.entries()**           | 서버 에러 객체 순회             | 필드가 많아도 일괄 자동 도장(Mapping) 가능       |
| **type: "server"**             | 에러 출처 명시                  | 서버발 에러 구분 및 추후 스타일링/로깅 분리 용이 |
| **reValidateMode: "onChange"** | 사용자 입력 모니터링            | 재입력 시 기존 서버 에러 자동 초기화로 UX 향상   |
