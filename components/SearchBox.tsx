type SearchBoxProps = {
  value: string;
  onChange: (text: string) => void;
};

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <input
        type="text"
        placeholder="회사명, 기사 제목, 언론사 검색하기"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          fontSize: "16px",
          backgroundColor: "#ffffff",
        }}
      />
    </div>
  );
}