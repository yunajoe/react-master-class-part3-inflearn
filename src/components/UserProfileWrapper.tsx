import type { User } from "../types/user";
import UserProfile from "./UserProfile";

function UserProfileWrapper() {
  const currentUser: User = {
    id: 1004,
    displayName: "React with TypeScript",
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "60px",
        textAlign: "center",
      }}
    >
      <header>
        <h1
          style={{ color: "#2c3e50", fontSize: "2.5rem", marginBottom: "10px" }}
        >
          03강. 정밀 설계도 시스템
        </h1>
        <p style={{ color: "#7f8c8d", fontSize: "1.1rem" }}>
          TypeScript Interface & import type 문법 최적화 실습
        </p>
      </header>

      <hr
        style={{ margin: "2.5rem 0", border: "0", borderTop: "1px solid #eee" }}
      />

      <main style={{ display: "flex", justifyContent: "center" }}>
        <UserProfile user={currentUser} />
      </main>
    </div>
  );
}

export default UserProfileWrapper;
