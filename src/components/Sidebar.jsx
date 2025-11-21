import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";

function Sidebar({ setActiveSpace }) {
  const [spaces, setSpaces] = useState([]);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [currentActiveSpace, setCurrentActiveSpace] = useState("Queue");

  const inputRef = useRef(null);

  useEffect(() => {
    if (isInputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputVisible]);

  const handleClick = (spaceName) => {
    setCurrentActiveSpace(spaceName);
    setActiveSpace(spaceName);
  };

  const getSpaces = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/spaces");
      setSpaces(response.data);
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      console.error(`API Error (${status || "Network"}):`, message);

      if (status >= 500) {
        alert(`Server Error: ${message}`);
      }
    }
  }, [setSpaces]);

  const postSpaces = useCallback(async () => {
    const name = newSpaceName.trim();

    if (!name) {
      alert("Space name cannot be blank.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/space", {
        spaceName: name,
      });

      console.log("SUCCESS: Space created", response.data);

      setNewSpaceName("");
      setIsInputVisible(false);

      getSpaces();
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "An unknown server error.";

      console.error(`POST Error (${status}):`, message);
      alert(`Error adding space: ${message}`);
    }
  }, [newSpaceName, setNewSpaceName, setIsInputVisible, getSpaces]);

  useEffect(() => {
    getSpaces();
  }, [getSpaces]);

  return (
    <div
      className="d-flex flex-column p-3 h-100"
      style={{ backgroundColor: "#FFFFFF", borderRight: "1px solid #E4E6EA" }}
    >
      <h3 className="mb-4" style={{ color: "#7A5DF6" }}>
        Stackly
      </h3>
      <div
        className="flex-grow-1"
        style={{ overflowY: "auto", marginBottom: "10px" }}
      >
        <div className="list-group">
          <a
            href="#"
            className={`mb-2 list-group-item ${
              currentActiveSpace === "Queue" ? "active" : ""
            }`}
            onClick={() => handleClick("Queue")}
          >
            Queue
          </a>

          {spaces.map((space) => (
            <a
              href="#"
              key={space.spaceName}
              className={`mb-2 list-group-item ${
                currentActiveSpace === space.spaceName ? "active" : ""
              }`}
              onClick={() => handleClick(space.spaceName)}
              style={{ cursor: "pointer" }}
            >
              {space.spaceName}
            </a>
          ))}
        </div>
      </div>

      {isInputVisible ? (
        <div className="mt-auto list-group-item d-flex flex-column">
          <input
            type="text"
            placeholder="Enter space name"
            className="form-control mb-1"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                postSpaces();
              }
            }}
            value={newSpaceName}
            onChange={(e) => setNewSpaceName(e.target.value)}
          />
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-sm btn-light me-2"
              onClick={() => setIsInputVisible(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={postSpaces}
              disabled={newSpaceName.trim() === ""}
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-link text-muted mt-auto list-group-item"
          onClick={() => setIsInputVisible(true)}
        >
          + Add Space
        </button>
      )}
    </div>
  );
}

export default Sidebar;
