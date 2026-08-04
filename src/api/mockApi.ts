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
