export const userKeys = {
  all: ["users"] as const,

  // lists: 전체
  lists: () => [...userKeys.all, "list"] as const,

  // details
  details: () => [...userKeys.all, "detail"] as const, //  ["users", "detail"]

  // detail(id)
  detail: (id: number) => [...userKeys.details(), id] as const, //  ["users", "detail", 5]
};
