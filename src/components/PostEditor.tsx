import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  updatePost,
  type MutationPost,
  type UpdatePostDto,
} from "../api/mockApi";

function PostEditor() {
  const [title, setTitle] = useState("기존 제목");
  // useMutation은 세 가지 제네릭 인자를 받는다. useMutation<TData, TError, TVariables>
  const { mutate, isPending } = useMutation<MutationPost, Error, UpdatePostDto>(
    {
      mutationFn: (newPost) => updatePost(newPost),
      //  임무 완수 시 서버 응답 데이터(data)와 전송 데이터(variables)를 받아 축하 파티(성공 피드백)를 엽니다.
      onSuccess(data, variables, onMutateResult, context) {
        console.log(`✅ 성공: [${data.title}]로 수정되었습니다.`);
        alert(`성공적으로 수정되었습니다! (보낸 데이터: ${variables.title})`);
      },
      // 실패 원인과 시도했던 데이터를 분석해 정밀한 에러 로그
      onError(error, variables, onMutateResult, context) {
        console.error(`❌ 실패: ${error.message}`);
        alert(`수정 실패! [${variables.title}] 요청을 다시 확인하세요.`);
      },
      //  성공/실패 여부와 상관없이 무조건 실행
      onSettled(data, error, variables, onMutateResult, context) {
        console.log("🏁 모든 통신 프로세스 종료.");
      },
    },
  );

  const handleSubmit = () => {
    mutate({ id: 1, title, content: "수정된 내용입니다." });
  };
  return (
    <div
      style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "수정 요청 중..." : "서버 데이터 수정하기"}
      </button>
      {isPending && <p style={{ color: "blue" }}>🛰️ 서버와 통신 중입니다...</p>}
    </div>
  );
}

export default PostEditor;
