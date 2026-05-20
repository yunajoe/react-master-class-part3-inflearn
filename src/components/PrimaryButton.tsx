interface PrimaryButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant: "solid" | "outline";
  isLoading?: boolean;
}
function PrimaryButton({
  variant,
  isLoading,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      disabled={isLoading}
      {...props}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: isLoading ? "not-allowed" : "pointer",
        backgroundColor: variant === "solid" ? "#646cff" : "transparent",
        color: variant === "solid" ? "white" : "#646cff",
        border: "1px solid #646cff",
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading ? "처리 중..." : children}
    </button>
  );
}

export default PrimaryButton;
