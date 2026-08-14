import { useState } from "react";
import { useBulkDeleteUsers } from "../hooks/use-bulkdelete";

export const UserAdminPage = () => {
  // 실습을 위해 5명의 ID가 미리 선택된 상태로 가정합니다.
  const [selectedIds, setSelectedIds] = useState<number[]>([
    101, 102, 103, 104, 105,
  ]);
  const bulkDelete = useBulkDeleteUsers();

  const handleCompleteDelete = () => {
    if (selectedIds.length === 0) return;

    // [핵심] 반복문 없이 선택된 배열을 통째로 넘겨 '단 한 번'의 통신을 트리거합니다.
    bulkDelete.mutate(selectedIds, {
      onSuccess: () => setSelectedIds([]),
    });
  };

  return (
    <>
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>회원 관리 시스템 (배칭 최적화 적용)</h2>
        <p>
          선택된 유저 수: <strong>{selectedIds.length}명</strong>
        </p>

        <button
          onClick={handleCompleteDelete}
          disabled={selectedIds.length === 0 || bulkDelete.isPending}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6f42c1",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {bulkDelete.isPending ? "폭풍을 잠재우는 중..." : "일괄 삭제 실행"}
        </button>

        <p style={{ color: "#666", fontSize: "0.85rem" }}>
          * 네트워크 탭에서 79강의 폭포수 요청이 사라졌는지 확인하세요.
        </p>
      </div>
    </>
  );
};
