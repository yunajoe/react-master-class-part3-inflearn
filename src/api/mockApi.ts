export interface Post {
  id: number;
  title: string;
  body: string;
}

export interface User {
  name: string;
  email: string;
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
