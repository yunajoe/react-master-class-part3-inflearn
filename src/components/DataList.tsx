interface DataListProps<T extends { id: string | number }> {
  items: T[];
  renderRow: (item: T) => React.ReactNode;
}

function DataList<T extends { id: string | number }>({
  items,
  renderRow,
}: DataListProps<T>) {
  return (
    <div
      style={{
        border: "1px solid #e1e4e8",
        borderRadius: "8px",
        overflow: "hidden",
        marginTop: "20px",
        backgroundColor: "#fff",
      }}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          style={{
            padding: "12px 20px",
            borderBottom:
              index === items.length - 1 ? "none" : "1px solid #eee",
          }}
        >
          {renderRow(item)}
        </div>
      ))}
    </div>
  );
}

export default DataList;
