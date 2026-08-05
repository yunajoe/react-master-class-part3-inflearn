import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { fetchPosts } from "../api/jsonPlaceholder";
import type { Post } from "../api/mockApi";

function InfinitePostList() {
  /**
   * useInfiniteQuery의 5가지 제네릭:
   * 1. TQueryFnData: API가 반환하는 타입 (Post[])
   * 2. TError: 에러 객체 타입 (Error)
   * 3. TData: 최종 데이터 형태 (InfiniteData<Post[], number>)
   * 4. TQueryKey: 쿼리 키 타입 (string[])
   * 5. TPageParam: 페이지 파라미터 타입 (number)
   */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<
      Post[],
      Error,
      InfiniteData<Post[], number>,
      string[],
      number
    >({
      queryKey: ["posts", "infinite"],
      //  queryFn: 엔진이 관리하는 pageParam을 주입받아 API를 호출
      queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),

      // getNextPageParam [두뇌]: 마지막 페이지(lastPage)를 분석해 다음 파라미터를 결정
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length > 0 ? allPages.length + 1 : undefined;
      },

      //  initialPageParam [필수]: 첫 페이지를 시작할 기본값
      initialPageParam: 1,

      // 최신 5 페이지만 메모리에 유지하고 나머지는 날려버려 저사양 기기의 부하를 방어
      maxPages: 5,

      // 누적된 모든 페이지를 한꺼번에 재요청하는 대참사를 막기 위해 5분의 신선도를 부여합
      staleTime: 1000 * 60 * 5,
    });

  const allPosts = data?.pages.flatMap((page) => page) ?? [];
  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {allPosts.map((post) => (
          <li
            key={post.id}
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid #eee",
              backgroundColor: "#fff",
              borderRadius: "8px",
              marginBottom: "0.5rem",
            }}
          >
            <strong>
              {post.id}. {post.title}
            </strong>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              {post.body.substring(0, 80)}...
            </p>
          </li>
        ))}
      </ul>
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        style={{
          width: "100%",
          padding: "1rem",
          backgroundColor: hasNextPage ? "#007bff" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: hasNextPage ? "pointer" : "not-allowed",
        }}
      >
        {isFetchingNextPage
          ? "⏳ 불러오는 중..."
          : hasNextPage
            ? "➕ 게시글 더 보기"
            : "🏁 마지막 페이지입니다"}
      </button>
    </div>
  );
}

export default InfinitePostList;
