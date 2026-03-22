type SortBoxProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SortBox({ value, onChange }: SortBoxProps) {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          fontSize: "16px",
          backgroundColor: "#ffffff",
          boxSizing: "border-box",
        }}
      >
        <option value="latest">최신순</option>
        <option value="oldest">오래된순</option>
        <option value="amount_desc">금액 큰 순</option>
        <option value="company_asc">회사명순</option>
      </select>
    </div>
  );
}