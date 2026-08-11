/**
 * [오류 해결 포인트]
 * 반드시 interface 앞에 'export'를 붙여야 다른 파일에서 임포트할 수 있습니다.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  address: {
    city: string;
    street: string;
    zipcode: string;
  };
}

// 유저 목록을 가져오는 가짜 API (0.5초 지연)
export const fetchUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Gemini",
          email: "ai@google.com",
          phone: "010-1234",
          isActive: true,
          address: { city: "Seoul", street: "Tech-ro", zipcode: "123" },
        },
        {
          id: 2,
          name: "React",
          email: "fb@meta.com",
          phone: "010-5678",
          isActive: false,
          address: { city: "Palo Alto", street: "Hacker Way", zipcode: "456" },
        },
        {
          id: 3,
          name: "TypeScript",
          email: "ms@microsoft.com",
          phone: "010-9999",
          isActive: true,
          address: { city: "Redmond", street: "One MS Way", zipcode: "789" },
        },
      ]);
    }, 500);
  });
};
