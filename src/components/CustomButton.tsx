// ComponentPropsWithRef: HTML <button>의 모든 표준 속성을 복제
// Omit: 그 중 기존의 'color' 속성은 제거하고, 우리의 customColor로 대체
interface CustomButtonProps extends Omit<
  React.ComponentPropsWithRef<"button">,
  "color"
> {
  customColor: "primary" | "secondary";
  children: React.ReactNode;
}

function CustomButton({
  customColor,
  children,
  style,
  ...rest
}: CustomButtonProps) {
  const buttonStyle = {
    backgroundColor: customColor === "primary" ? "#646cff" : "#2f3640",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  };
  return (
    <button style={buttonStyle} {...rest}>
      {children}
    </button>
  );
}

export default CustomButton;
