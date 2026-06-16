import z from "zod";

export const signupSchema = z
  .object({
    email: z.string().min(1, "이메일은 필수 입력 사항입니다."),

    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
      .regex(/[A-Z]/, "대문자를 최소 하나 포함해야 합니다.")
      .regex(/[0-9]/, "숫자를 최소 하나 포함해야 합니다."),

    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
    role: z.enum(["user", "creator"], {
      error: "",
      message: "가입 유형을 선택해주세요.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
