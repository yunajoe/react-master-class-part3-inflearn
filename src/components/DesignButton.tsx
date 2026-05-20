type Color = "primary" | "secondary" | "accent";

type Level = 100 | 200 | 300 | 400 | 500;

type DesignToken = `${Color}-${Level}`;

interface DesignButtonProps {
  token: DesignToken;
  label: string;
}

function DesignButton({ token, label }: DesignButtonProps) {
  return (
    <button
      className={`btn-${token}`}
      style={{
        padding: "10px 20px",
        margin: "10px",
        borderRadius: "6px",
        border: "1px solid #646cff",
        backgroundColor: token.startsWith("primary") ? "#646cff" : "#eee",
        color: token.startsWith("primary") ? "white" : "#333",
      }}
    >
      {label} (토큰: {token})
    </button>
  );
}

export default DesignButton;
