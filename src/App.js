import './styles/App.css';
import Sidebar from "./components/Sidebar.jsx";
import Queue from "./components/Queue.jsx";

function App() {
  return (
<div className="container-fluid px-0" style={{ height: "100vh" }}>
      <div className="row gx-0" style={{ height: "100%" }}>
    {/* Sidebar */}
    <div className="col-2 bg-light vh-100">
      <Sidebar />
    </div>

    {/* Main Workspace */}
    <Queue />
  </div>
</div>
  );
}

export default App;
