export interface SearchItem {
  id: number;
  title: string;
}

/**
 * 서버 검색 시뮬레이션 (의도적인 1초 지연)
 */
export const fetchSearchResults = async (
  query: string,
): Promise<SearchItem[]> => {
  return new Promise((resolve) => {
    // 깜빡임 현상을 극명하게 관찰하기 위해 1초의 딜레이를 줍니다.
    setTimeout(() => {
      if (!query) return resolve([]);

      // 검색어를 포함한 가짜 결과를 생성하여 데이터 교체를 시뮬레이션합니다.
      const results = Array.from({ length: 5 }, (_, i) => ({
        id: Math.random(), // 쿼리마다 새로운 ID를 생성해 캐시 교체를 명확히 보여줍니다.
        title: `'${query}'에 대한 검색 결과 ${i + 1}`,
      }));
      resolve(results);
    }, 1000);
  });
};
