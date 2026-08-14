import { http, HttpResponse } from "msw";

export const handlers = [
  // 벌크 삭제 요청을 처리하는 가짜 서버 핸들러입니다.
  http.post("/api/users/bulk-delete", async ({ request }) => {
    const { ids } = (await request.json()) as { ids: number[] };

    // 서버가 단 하나의 DB 트랜잭션으로 처리함을 시뮬레이션합니다.
    console.log(
      `[MSW Server] 다음 ID들에 대해 원자적 삭제를 수행합니다: ${ids.join(", ")}`,
    );

    return HttpResponse.json({
      success: true,
      count: ids.length,
      message: "배칭 전략으로 모든 데이터가 안전하게 처리되었습니다.",
    });
  }),
];
