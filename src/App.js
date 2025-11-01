import './styles/App.css';
import Sidebar from "./components/Sidebar.jsx";

function App() {
  return (
   <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ padding: "2rem", flex: 1 }}>
        <h2>Main Workspace</h2>
      </div>
    </div>
  );
}

export default App;
