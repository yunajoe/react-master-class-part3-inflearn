import { useEffect, useState } from "react";
import type { User } from "../api/mockApi";
import { fetchUser } from "../api/mockApi";

// 1. 네비게이션 바: 상단에서 유저 이름을 보여줍니다.
export const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);
  return (
    <nav style={{ borderBottom: "1px solid #ccc" }}>
      👤 {user?.name}님 환영합니다
    </nav>
  );
};

// 2. 사이드바: 왼쪽에서 유저의 소개글을 보여줍니다.
export const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);
  return (
    <aside style={{ width: "200px", background: "#f9f9f9" }}>
      📝 소개: {user?.bio}
    </aside>
  );
};

// 3. 퀵메뉴: 하단에서 유저의 이메일을 보여줍니다.
export const QuickMenu = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);
  return (
    <div style={{ position: "fixed", bottom: 10, right: 10 }}>
      📧 {user?.email}
    </div>
  );
};
