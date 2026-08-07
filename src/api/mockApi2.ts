// 유저 정보를 위한 표준 규격
export interface User {
  id: number;
  name: string;
}

//  Key Factory 패턴: 무효화의 범위를 결정하는 설계도
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
};

export const updateUserApi = async (updatedUser: User): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`📡 [Network] 서버 데이터 수정 완료: ${updatedUser.name}`);
      resolve(updatedUser);
    }, 500);
  });
};

export const fetchUserApi = async (id: number): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "시니어 개발자 (수정 전)" });
    }, 300);
  });
};

export interface Todo {
  id: number;
  text: string;
}

export const todoKeys = {
  all: ["todos"] as const,
};

export const postTodoApi = async (newTodo: Todo): Promise<Todo> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.3) reject(new Error("서버 저장에 실패했습니다."));
      resolve(newTodo);
    }, 1000);
  });
};

export interface Post2 {
  id: number;
  title: string;
  body: string;
}

// 상세 데이터 요청 (0.5초 지연)
export const fetchPostById = async (id: number): Promise<Post2> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: `${id}번째 글 상세 제목`,
        body: `이 내용은 ${id}번 글의 상세 본문입니다. 프리페칭 덕분에 로딩 없이 보입니다.`,
      });
    }, 500);
  });
};

// 무한 리스트 요청 (0.5초 지연)
export const fetchPosts = async (page: number) => {
  return new Promise<{ posts: Post2[]; nextCursor: number | undefined }>(
    (resolve) => {
      setTimeout(() => {
        const posts = Array.from({ length: 10 }, (_, i) => ({
          id: page * 10 + i + 1,
          title: `${page * 10 + i + 1}번째 게시글 제목`,
          body: "",
        }));
        resolve({ posts, nextCursor: page < 5 ? page + 1 : undefined });
      }, 500);
    },
  );
};
