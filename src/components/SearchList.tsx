import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchSearchResults } from "../api/searchApi";

function SearchList() {
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * 쿼리 키를 ['search', searchTerm]으로 구성하여 검색어 변화를 추적합니다.
   *
   */
  const { data, isPlaceholderData, isFetching, isLoading, isError } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: () => fetchSearchResults(searchTerm),
    placeholderData: keepPreviousData,
  });

  const displayData = searchTerm === "" ? [] : data;

  if (isError) {
    return (
      <div style={{ color: "red", padding: "10px" }}>
        검색 결과를 불러오는 데 실패했습니다.
      </div>
    );
  }
  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요..."
        style={{
          width: "100%",
          padding: "12px",
          boxSizing: "border-box",
          marginBottom: "20px",
        }}
      />
      <div
        style={{
          position: "relative",
          //  minHeight를 고정하여 데이터 교체 시 레이아웃 흔들림을 방지합
          minHeight: "250px",
          backgroundColor: "#f9f9f9",
          padding: "10px",
        }}
      >
        <ul
          style={{
            opacity: isPlaceholderData ? 0.5 : 1,
            transition: "opacity 0.2s ease-in-out",
            padding: 0,
            listStyle: "none",
          }}
        >
          {displayData?.map((item) => (
            <li
              key={item.id}
              style={{
                padding: "12px",
                borderBottom: "1px solid #eee",
                color: isPlaceholderData ? "#999" : "#333",
              }}
            >
              {item.title}
            </li>
          ))}
        </ul>
        {/*  이제 스피너는 isLoading이 아니라 백그라운드 업데이트 상태인 isFetching에 연결 */}
        {isFetching && (
          <div
            style={{
              marginTop: "15px",
              color: "#007bff",
              fontSize: "0.9rem",
              fontWeight: "bold",
            }}
          >
            🛰️ 최신 데이터를 업데이트 중입니다...
          </div>
        )}
        {isLoading && searchTerm !== "" && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            초기 데이터를 가져오는 중...
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchList;
