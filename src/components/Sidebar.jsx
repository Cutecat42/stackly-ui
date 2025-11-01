function Sidebar() {
    return (
    <div className="d-flex flex-column p-3 h-100" style={{ backgroundColor: "#FFFFFF", borderRight: "1px solid #E4E6EA" }}>
      <h3 className="mb-4" style={{ color: "#7A5DF6" }}>Stackly</h3>

      <div className="mb-2">Queue</div>
      <div className="text-muted mt-auto">+ Add Space</div>
    </div>
    );
}

export default Sidebar;