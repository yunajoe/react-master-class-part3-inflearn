export interface User {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
}

// [로직 1] 이메일로 유저 정보를 가져오는 트리거 API
export const fetchUserByEmail = async (email: string): Promise<User> => {
  return new Promise((resolve) => {
    // 0.5초의 지연을 주어 네트워크 워터폴을 시각적으로 확인합니다.
    setTimeout(() => resolve({ id: 101, name: "Gemini" }), 500);
  });
};

// [로직 2] 유저 ID에 의존하여 게시글을 가져오는 API
export const fetchPostsByUserId = async (userId: number): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "의존적 쿼리 완벽 가이드" },
        { id: 2, title: "TanStack Query 실무 팁" },
      ]);
    }, 500);
  });
};
