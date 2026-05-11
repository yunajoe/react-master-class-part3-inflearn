import type { User } from "../types/user";

// 타입스크립트 3.8부터 도입된 문법으로, 오직 타입 정보만을 위해 가져온다는 것을 명시합니다. 이는 컴파일 시 실제 자바스크립트 코드에서 완전히 제거되어 실행 성능을 높입니다.
// 중요: 실제 실행 로직이 아닌 '설계도(타입)' 정보만 가져옵니다.
interface UserProfileProps {
  user: User;
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #646cff",
        borderRadius: "12px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: 0, color: "#333" }}>👤 엔지니어 프로필</h3>
      <p style={{ fontSize: "1.2rem", margin: "15px 0" }}>
        성함: <strong>{user.displayName.toUpperCase()}</strong>
      </p>
      <code
        style={{ color: "#666", backgroundColor: "#eee", padding: "2px 5px" }}
      >
        ID Tag: {user.id}
      </code>
    </div>
  );
}

export default UserProfile;
