/**
 *. 1. T (Target): 버거의 핵심 재료입니다. 우리 스토어에 담길 실제 데이터(User, Token 등)의 규격입니다.
 *  2. StateCreator: 버거의 조리법입니다. (set, get, store) 인자를 받아 상태를 정의하는 함수 그 자체
 *  3. Mps (Mutator Previous): 이전 층에 이미 발라져 있는 소스(이미 적용된 다른 미들웨어 정보)
 *  4. Mcs (Mutator Current): 지금 우리가 새로 끼워 넣는 로거라는 패티의 정보
 *  5. StoreMutatorIdentifier: 이 패티가 '로거'임을 알려주는 이름표
 *
 *  이 복잡한 제네릭 체인은 "지금까지 어떤 미들웨어들이 거쳐갔고, 이번에 어떤 기능이 추가되는가?"를 타입스크립트가 끝까지 추적
 */

/* [Concept Code 2]: Zustand 내부 타입의 실제 모습 */
// export type StateCreator<
//   T,
//   Mps extends [StoreMutatorIdentifier, unknown][] = [], // 앞선 미들웨어들의 누적 타입 로그
//   Mcs extends [StoreMutatorIdentifier, unknown][] = [], // 현재 미들웨어가 추가할 타입 로그
// > = (
//   set: StoreApi<T>["setState"],
//   get: StoreApi<T>["getState"],
//   store: StoreApi<T>,
// ) => T; ㅇ

import type { StateCreator, StoreMutatorIdentifier } from "zustand";

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string,
) => StateCreator<T, Mps, Mcs>;

export const logger: Logger = (f, name) => (set, get, store) => {
  const loggedSet: typeof set = (...a) => {
    // 시각적 가시성을 위해 %c를 사용하여 콘솔 텍스트에 색상을 입힙니다.
    console.log(
      `%c[Zustand] ${name || "Store"} 업데이트 시작`,
      "color: #4CAF50; font-weight: bold;",
    );

    // [3] 업데이트 직전의 생생한 현재 상태를 사진 찍듯 기록합니다.
    console.log("이전 상태(Prev):", get());

    /** * [4] 실제 상태 변경 수행
     * Zustand의 set은 동기(Synchronous)적으로 작동합니다.
     * 즉, 이 줄이 끝나면 상태는 이미 변해 있습니다.
     */
    set(...a);

    // [5] 변경된 결과물을 다시 스냅샷 찍어 대조합니다.
    console.log("다음 상태(Next):", get());
    console.log("%c업데이트 완료", "color: #4CAF50; font-weight: bold;");
  };
  /**
   * [6] 마지막 관문: 원본 조리법 f를 실행합니다.
   * 이때, 원래의 set 대신 우리가 가로챈 loggedSet을 전달하는 것이 핵심입니다.
   */

  // 로깅 기능이 가로챈 set 함수가 주입된 상태로 생성된, 최종 스토어 상태 객체
  return f(loggedSet, get, store);
};
