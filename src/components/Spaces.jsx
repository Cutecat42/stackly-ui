import { useState, useEffect, useCallback } from "react";
import Stacks from "./Stacks";
import axios from "axios";

const chunkArray = (arr, size) => {
  const chunkedArr = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size));
  }
  return chunkedArr;
};

function Spaces({ spaceName }) {
  const [stacks, setStacks] = useState([]);
  const [selectedStackName, setSelectedStackName] = useState(null);

  const getStacks = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/" + spaceName + "/stacks"
      );
      setStacks(response.data);
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
  }, [setStacks, spaceName]);

  useEffect(() => {
    getStacks();
  }, [getStacks]);

  useEffect(() => {
    setSelectedStackName(null);
  }, [spaceName]);

  const handleClick = (stackName) => {
    setSelectedStackName(stackName);
  };

  const handleBack = () => {
    setSelectedStackName(null);
  };

  const chunkedStacks = chunkArray(stacks, 3);

  return (
    <>
      {selectedStackName === null ? (
        <div
          data-testid="space-container"
          className="mb-2 p-4"
          style={{ backgroundColor: "#EDEDED", height: "100%" }}
        >
          <div className="ps-4">
            <h2 className="mb-3" style={{ color: "#7A5DF6" }}>
              {spaceName} Space
            </h2>
            <div
              className="border border-secondary-subtle"
              style={{
                maxHeight: "calc(100vh - 101px)",
                overflowY: "auto",
              }}
            >
              <div className="row mx-0">
                {chunkedStacks.map((rowOfStacks, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`col-12 p-0 ${
                      rowIndex % 2 === 1 ? "bg-light" : ""
                    }`}
                  >
                    <div className="row g-0">
                      {rowOfStacks.map((stack) => (
                        <div
                          key={stack.stackName}
                          className="col-md-4 col-sm-6 p-0"
                        >
                          <a
                            href="#"
                            className="p-3 text-dark text-decoration-none d-block"
                            onClick={() => handleClick(stack.stackName)}
                            style={{ cursor: "pointer" }}
                          >
                            {stack.stackName}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="mb-2 p-4"
          style={{ backgroundColor: "#EDEDED", height: "100%" }}
        >
          <div className="ps-4">
            <button
              className="btn btn-sm btn-primary mb-1"
              onClick={handleBack}
            >
              &larr; Back to Stacks
            </button>
            <Stacks stackName={selectedStackName} />
          </div>
        </div>
      )}
    </>
  );
}

export default Spaces;
