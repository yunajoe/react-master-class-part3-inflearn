import axios from "axios";
/**
 * Post 인터페이스: 개별 게시글의 규격입니다.
 * export를 통해 외부 모듈에서 이 타입을 안전하게 참조할 수 있도록 설계합니다.
 */
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

/**
 * 실제 API 호출 함수
 * JSONPlaceholder는 _page와 _limit 파라미터를 통해 페이지네이션을 지원합니다.
 */
export const fetchPosts = async (pageParam: number): Promise<Post[]> => {
  const response = await axios.get<Post[]>(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`,
  );
  // 현실적인 네트워크 지연 시뮬레이션 (0.5초)
  await new Promise((resolve) => setTimeout(resolve, 500));
  return response.data;
};
