function Sidebar({ setActiveSpace }) {

  const handleClick = (spaceName, event) => {
    document.querySelector('.active').classList.remove('active');
    const classNameElement = event.target;
    classNameElement.classList.add('active');
    setActiveSpace(spaceName);
  };

  return (
    <div className="d-flex flex-column p-3 h-100" style={{ backgroundColor: "#FFFFFF", borderRight: "1px solid #E4E6EA" }}>
      <h3 className="mb-4" style={{ color: "#7A5DF6" }}>Stackly</h3>

      <div className="list-group">
      <a href="#" className="mb-2 list-group-item active" onClick={(e) => handleClick(null, e)}>Queue</a>
      <br></br>
      <a href="#" className="mb-2 list-group-item" onClick={(e) => handleClick("HR", e)}>HR</a>
      <a href="#" className="mb-2 list-group-item" onClick={(e) => handleClick("Accounting", e)}>Accounting</a>
      </div>

      <div className="text-muted mt-auto list-group-item">+ Add Space</div>
      
    </div>
    );
}

export default Sidebar;