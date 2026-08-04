export interface Post {
  id: number;
  title: string;
  body: string;
}

export interface User {
  name: string;
  email: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}
export const fetchPostById = async (id: number | string): Promise<Post> => {
  const delay = id === 1 || id === "1" ? 3000 : 500;

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  );
  const data = await response.json();

  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const fetchUser = async (): Promise<User> => {
  console.log("📡 [Network Log] 실제 API 서버에 유저 정보 요청 중...");
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/1`);
  return response.json();
};

export const fetchUserData = async (userId: number) => {
  console.log("📡 [Network Log] 실제 API 서버에 유저 정보 요청 중...");
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );
  return response.json();
};

export interface User2 {
  id: number;
  name: string;
  email: string;
  bio: string;
}

// 호출 횟수를 추적하기 위한 카운터
let callCount = 0;

export const fetchUser2 = async (): Promise<User2> => {
  callCount++;
  console.log(`📡 [Network Log] 서버 요청 발생! (총 호출 횟수: ${callCount})`);
  // 실제 네트워크 지연을 시뮬레이션합니다.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "프론트엔드 시니어",
        email: "senior@dev.com",
        bio: "리액트 아키텍처를 설계하는 개발자입니다.",
      });
    }, 1000);
  });
};

export interface UserDetail {
  id: number;
  name: string;
  email: string;
  avatar: string;
}
export const fetchUserDetail = async (id: number): Promise<UserDetail> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //  테스트를 위해 ID가 0인 경우 에러 발생 시뮬레이션
      if (id === 0) reject(new Error("존재하지 않는 유저입니다."));
      resolve({
        id,
        name: "선언적 아키텍트",
        email: "decl@dev.com",
        avatar: "<https://api.dicebear.com/7.x/avataaars/svg?seed=1>",
      });
    }, 1000);
  });
};

export interface DelayUser {
  id: number;
  name: string;
}

export interface DelayPost {
  id: number;
  title: string;
  content: string;
}

/**
 * 유저 데이터를 가져오는 함수 (2초 지연)
 */
export const fetchDelayUser = async (id: number): Promise<DelayUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // ⚠️ 테스트를 위해 id가 0이면 에러 발생
      if (id === 0) reject(new Error("존재하지 않는 유저입니다."));
      resolve({ id, name: "시니어 아키텍트" });
    }, 2000);
  });
};

/**
 * 게시글 목록을 가져오는 함수 (2초 지연)
 */
export const fetchDelayPosts = async (id: number): Promise<DelayPost[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "첫 번째 게시글", content: "내용입니다." },
        { id: 2, title: "두 번째 게시글", content: "내용입니다." },
      ]);
    }, 2000);
  });
};

/**
 *
 * 인터페이스의 분리: 서버로부터 받아오는 게시글의 표준 규격인 Post와 수정 요청 시 사용하는 데이터 전송 객체인 UpdatePostDto를 분리했습니다.
 * 이는 타입스크립트 엔진이 성공 시 반환되는 데이터의 형태를 정확히 이해하도록 돕습니다
 */

export interface MutationPost {
  id: number;
  name: string;
  title: string;
  content: string;
}

/**
 * DTO의 역할:UpdatePostDto는 우리가 mutate 함수를 호출할 때 어떤 데이터를 인자로 넘겨야 하는지 엄격하게 규정하여 런타임 에러를 방지
 */
export interface UpdatePostDto {
  id: number;
  title: string;
  content: string;
}

export const updatePost = async (
  newPost: UpdatePostDto,
): Promise<MutationPost> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      /**
       *  의도적인 에러 설계: 10%의 확률로 reject가 발생하도록 설계하여 onError 콜백이나 ErrorBoundary가 정상적으로 비상 상황을 감지하는지 테스트할 수 있는 환경을 마련
       */
      if (Math.random() < 0.1)
        reject(new Error("서버에서 수정을 거절했습니다."));
      resolve({
        id: newPost.id,
        name: "시니어 아키",
        title: "기본 제목",
        content: "기본 내용",
      });
    }, 2000);
  });
};

export interface PostDto2 {
  id: number;
  title: string;
  content: string;
}

export interface Post2 extends PostDto2 {
  updatedAt: string;
}

// 수정 API (1초 지연)
export const updatePostApi = async (updateData: PostDto2): Promise<Post2> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...updateData, updatedAt: new Date().toISOString() });
    }, 1000);
  });
};
