import { useMutation } from "@tanstack/react-query";
import { updatePostApi, type PostDto2 } from "../api/mockApi";

function ReloadEditor() {
  const { mutate } = useMutation({
    // mutationFn은 서버에 PATCH 요청을 날려 실제 데이터를 변형하는 배달원
    mutationFn: (updateData: PostDto2) => updatePostApi(updateData),

    // 요청이 성공했을 때 실행되는 onSuccess 콜백
    onSuccess: () => {
      // 서버 수정은 성공했지만 브라우저 RAM 속 스냅샷을 갱신할 방법을 모르는 상태
      // 결국 가장 원시적인 해결책인 새로고침을 선택하여 SPA의 장점을 포기
      /**
       * 메모리 삭제: 현재 페이지의 모든 상태(useState 등)가 메모리에서 완전히 삭제됩니다.
재요청: 브라우저는 서버로부터 다시 HTML 문서를 요청합니다.
현실 비유: 이는 마치 거실의 전구 하나를 갈기 위해 집 전체의 차단기를 내리고 모든 가전제품을 다시 처음부터 부팅시키는 것과 같습니다.
       * 
       */
      window.location.reload();
    },
  });
  return (
    <div>
      <button
        onClick={() => {
          mutate({ id: 10, title: "test", content: "test" });
        }}
      >
        수정 후 강제 새로고침 (항복 버튼)
      </button>
    </div>
  );
}

export default ReloadEditor;
