export default function SearchBar({ value, onChange, placeholder = "Search AI agents..." }) {
  return (
    <div style={{ width: "100%", maxWidth: 820 }}>
      <label style={{ display: "block", marginBottom: 8, color: "#999" }}>{placeholder}</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.06)",
            background: "transparent",
            color: "inherit",
            fontSize: 16,
          }}
        />
        <button style={{ padding: "12px 18px", borderRadius: 10 }}>Search</button>
      </div>
    </div>
  );
}
