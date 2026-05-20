import { useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
}

function ProfileEditor() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "홍길동",
    email: "gildong@react.com",
    bio: "리액트 공부 중",
  });

  const handleUpdate = (changes: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...changes }));
  };
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f4f4f4",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h3>현재 닉네임: {profile.name}</h3>
      <button onClick={() => handleUpdate({ name: "React Expert" })}>
        닉네임만 업데이트
      </button>
    </div>
  );
}

export default ProfileEditor;
