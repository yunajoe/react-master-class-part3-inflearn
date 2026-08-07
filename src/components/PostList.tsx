import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchPostById, fetchPosts } from "../api/mockApi2";

function PostList({ onSelect }: { onSelect: (id: number) => void }) {
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 0 }) => {
        return fetchPosts(pageParam as number);
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: 0,
    });

  // handleMouseEnter: 사용자가 클릭하기 전 약 100~300ms의  호버 시간을 활용하여 prefetchQuery를 실행합니다.
  // 여기서 staleTime: 5분 설정이 가장 핵심인데,
  // 이 시간이 설정되어야만 상세 페이지 진입 시 엔진이 데이터를
  // 다시 요청하지 않고 캐시를 즉시 반환합니다
  // [상황 1] 마우스 호버 프리페칭
  const handleMouseEnter = async (id: number) => {
    await queryClient.prefetchQuery({
      queryKey: ["pose", id],
      queryFn: () => fetchPostById(id),
      staleTime: 1000 * 60 * 6,
    });
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];
  return (
    <div>
      <ul>
        {allPosts.map((post) => (
          <li
            key={post.id}
            onMouseEnter={() => handleMouseEnter(post.id)}
            onClick={() => onSelect(post.id)}
            style={{
              padding: "1rem",
              border: "1px solid #eee",
              marginBottom: "0.5rem",
              cursor: "pointer",
              borderRadius: "8px",
            }}
          >
            <strong>
              {post.id}. {post.title}
            </strong>
            <div style={{ fontSize: "0.8rem", color: "#888" }}>
              마우스를 올리면 미리 가져옵니다
            </div>
          </li>
        ))}
      </ul>
      <div
        ref={loadMoreRef}
        style={{
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isFetchingNextPage &&
          "🛰️ 발바닥이 닿기 전 다음 데이터를 당겨오는 중..."}
      </div>
    </div>
  );
}

export default PostList;
