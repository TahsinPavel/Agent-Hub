export default function CategoryCarousel({ categories = [] }) {
  return (
    <div className="category-carousel" style={{ marginTop: 12 }}>
      <div className="carousel-inner" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
        {categories.map((c) => (
          <div key={c} className="category-pill" style={{ flex: "0 0 auto", padding: "8px 14px", borderRadius: 20, background: "rgba(255,255,255,0.03)", cursor: "pointer" }}>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
