import './styles/App.css';
import Sidebar from "./components/Sidebar.jsx";
import Main from "./components/Main.jsx";
import { useState } from 'react';

function App() {
  const [activeSpace, setActiveSpace] = useState(null);

  return (
<div className="container-fluid px-0" style={{ height: "100vh" }}>
      <div className="row gx-0" style={{ height: "100%" }}>
    {/* Sidebar */}
    <div className="col-2 bg-light vh-100">
      <Sidebar setActiveSpace={setActiveSpace} />
    </div>

    {/* Main Workspace */}
    <div className="col-10 p-0 vh-100">
          <Main activeSpace={activeSpace} />
        </div>
  </div>
</div>
  );
}

export default App;
