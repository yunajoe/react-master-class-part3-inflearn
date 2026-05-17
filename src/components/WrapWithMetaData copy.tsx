/* [File Path]: src/utils/wrapWithMetadata.ts
   [Copyright]: © nhcodingstudio 소유
   [Test Process]:
   1. src/utils 폴더 내부에 파일을 생성합니다.
   2. wrapWithMetadata<{ name: string }>({ name: "React" }) 처럼 타입을 주입해 봅니다.
   3. 반환된 객체의 .data 속성에서 name이 자동 완성되는지 확인합니다.
*/

/**
 * wrapWithMetadata: 주입된 타입 T를 그대로 보존하며 메타데이터를 추가합니다.
 * <T>는 이 함수가 호출될 때 결정될 '타입 변수'입니다.
 */
export function wrapWithMetadata<T>(content: T) {
  return {
    data: content, // 원본 데이터 (T 타입을 그대로 유지)
    timestamp: Date.now(), // 데이터 생성 시간
    id: Math.random().toString(36).substring(2, 9), // 고유 식별자
  };
}
