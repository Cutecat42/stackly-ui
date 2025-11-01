import './styles/App.css';
import Sidebar from "./components/Sidebar.jsx";

function App() {
  return (
<div className="container-fluid px-0" style={{ height: "100vh" }}>
      <div className="row gx-0" style={{ height: "100%" }}>
    {/* Sidebar */}
    <div className="col-2 bg-light vh-100">
      <Sidebar />
    </div>

    {/* Main Workspace */}
    <div className="col-10 p-4" style={{ backgroundColor: "#F7F8FA" }}>
      <h2 style={{ color: "#1A1A1A" }}>Main Workspace</h2>
          <p style={{ color: "#6A6A6A" }}>This is where your documents and stacks will appear.</p>
    </div>
  </div>
</div>
  );
}

export default App;
