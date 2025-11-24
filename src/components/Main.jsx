import Queue from "./Queue.jsx";
import Spaces from "./Spaces.jsx";

function Main({ activeSpace }) {
  const isQueueSelected = activeSpace === "Queue" || activeSpace === null;

  return (
    <div data-testid="main-container" className="h-100">
      {isQueueSelected ? <Queue /> : <Spaces spaceName={activeSpace} />}
    </div>
  );
}

export default Main;
