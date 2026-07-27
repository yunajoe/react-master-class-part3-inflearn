import { useEffect, useState } from "react";
import { fetchUser, type User } from "../api/mockApi";

function ProfileIcon() {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  return <span>👤 {user?.name}</span>;
}

function Sidebar() {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    fetchUser().then(setUser); // ❌ 중복 발생
  }, []);
  return (
    <aside style={{ background: "#eee", padding: "10px" }}>
      📧 {user?.name}의 사이드바
    </aside>
  );
}

function DuplicateRequest() {
  return (
    <div style={{ border: "2px solid blue", padding: "1rem", margin: "1rem" }}>
      <h3>🔥 2. 무분별한 중복 요청</h3>
      <ProfileIcon />
      <Sidebar />
      <p>
        💡 콘솔창에서 <code>[Network Log]</code> 중복 횟수를 확인하세요.
      </p>
    </div>
  );
}

export default DuplicateRequest;
