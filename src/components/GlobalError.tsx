import React, { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
  error: unknown;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  //  에러 발생 시 상태를 '에러 모드'로 즉시 전환합
  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  //  에러의 상세 정보를 외부 로그 서비스에 기록할 때 사용
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("🚨 에러 감지 지점 정보:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "알 수 없는 시스템 오류가 발생했습니다.";

      if (this.state.error instanceof Error) {
        errorMessage = this.state.error.message;
      }
      return (
        <div
          style={{
            padding: "30px",
            border: "2px solid red",
            borderRadius: "12px",
            backgroundColor: "#fff5f5",
          }}
        >
          <h2 style={{ color: "#e53e3e" }}>시스템 보호 모드 작동 중</h2>
          <p style={{ fontSize: "1.1rem" }}>
            에러 내용: <strong>{errorMessage}</strong>
          </p>
          <div style={{ marginTop: "20px" }}>{this.props.fallback}</div>
        </div>
      );
    }
  }
}
