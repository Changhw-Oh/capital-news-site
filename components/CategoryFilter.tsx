type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "24px",
      }}
    >
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            style={{
              padding: "10px 16px",
              borderRadius: "999px",
              border: "1px solid #cbd5e1",
              backgroundColor: isActive ? "#0f172a" : "#ffffff",
              color: isActive ? "#ffffff" : "#334155",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}