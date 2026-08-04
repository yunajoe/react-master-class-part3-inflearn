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
