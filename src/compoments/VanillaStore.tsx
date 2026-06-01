import { authStore, useAuth } from "../store/useVanillaStore";

function VanillaStore() {
  const { isLoggedIn, token, setToken } = useAuth();

  const handleLogin = () => {
    const mockToken = "abcdefg1234567890your_jwt_token_here";
    setToken(mockToken);
  };
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>26강. Vanilla API 실습</h1>
      <p>로그인 상태: {isLoggedIn ? "✅" : "❌"}</p>
      <p>현재 토큰: {token || "없음"}</p>

      <button onClick={handleLogin}>API 호출 테스트</button>
      <button
        onClick={() => {
          console.log("로그아웃");
          authStore.setState({ token: null, isLoggedIn: false });
        }}
        style={{ marginLeft: "10px", color: "red", width: "200px" }}
      >
        외부에서 로그아웃2222 (setState)
      </button>
    </div>
  );
}

export default VanillaStore;
