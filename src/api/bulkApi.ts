// 기존의 DELETE /users/:id 방식은 ID 개수만큼 요청이 발생하지만, 이 구조는 ID가 100개여도 단 한 번의 통신으로 끝납니다.
export const bulkDeleteUsers = async (
  userIds: number[],
): Promise<{ success: boolean }> => {
  const response = await fetch("/api/users/bulk-delete", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ ids: userIds }),
  });
  if (!response.ok) throw new Error("벌크 삭제 중 에러가 발생했습니다.");
  return response.json();
};
