type FetchStatus =
  | { state: "loading" }
  | { state: "success"; data: string }
  | { state: "error"; error: Error };

interface StatusDisplayProps {
  status: FetchStatus;
}
function StatusDisplay({ status }: StatusDisplayProps) {
  if (status.state === "success") {
    return (
      <div
        style={{
          color: "#2ecc71",
          padding: "10px",
          backgroundColor: "#eafaf1",
        }}
      >
        <strong>성공:</strong> {status.data}
      </div>
    );
  }
  if (status.state === "error") {
    return (
      <div
        style={{
          color: "#e74c3c",
          padding: "10px",
          backgroundColor: "#fdedec",
        }}
      >
        <strong>에러 발생:</strong> {status.error.message}
      </div>
    );
  }
  return (
    <div style={{ color: "#3498db", padding: "10px" }}>
      ⏳ 데이터를 불러오는 중입니다...
    </div>
  );
}

export default StatusDisplay;
