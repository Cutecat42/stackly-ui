import Queue from "./Queue.jsx";
import Spaces from "./Spaces.jsx";

function Main({ activeSpace }) {
  const showSpaces = activeSpace !== null;


  return (
    <div data-testid="main-container" className="h-100">
      {showSpaces ? (
        <Spaces spaceName={activeSpace}/>
      ) : (
        <Queue />
      )}
    </div>
  );
}

export default Main;