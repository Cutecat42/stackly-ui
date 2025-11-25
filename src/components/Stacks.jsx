import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

function Stacks({ stackName }) {
  const [documents, setDocuments] = useState([]);
  const [stackSchema, setStackSchema] = useState(null);
  const [uiError, setUiError] = useState(null);

  const handleDocumentClick = useCallback(async () => {
    setUiError(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/stack/${stackName}`
      );
      setStackSchema(response.data.fieldSchema);
    } catch (error) {
      console.error("Error fetching schema:", error);
      setUiError("Could not load stack schema.");
    }
  }, [stackName]);

  const getDocuments = useCallback(async () => {
    setUiError(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/stack/${stackName}/documents`
      );
      setDocuments(response.data);
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";

      console.error(`API Error (${status || "Network"}):`, message);

      if (status >= 500) {
        setUiError(`Server Error: ${message}`);
      } else {
        setUiError(`API Error: ${message}`);
      }
    }
  }, [setDocuments, stackName]);

  useEffect(() => {
    if (stackName) {
      getDocuments();
    }
  }, [stackName]);

  return (
    <>
      <div
        data-testid="stack-container"
        className="p-4 rounded-lg shadow-lg"
        style={{ backgroundColor: "#EDEDED", minHeight: "100%" }}
      >
        <h2 className="mb-4 text-xl font-bold" style={{ color: "#7A5DF6" }}>
          {stackName} Stack
        </h2>

        {uiError && (
          <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {uiError}
          </div>
        )}

        {documents.length === 0 ? (
          <p className="text-gray-500 italic">
            No documents found in this stack.
          </p>
        ) : (
          documents.map((document) => (
            <a
              href="#"
              key={document.documentNumber}
              className="d-block p-2 mb-1 bg-white hover:bg-gray-100 rounded-lg transition-colors duration-150"
              onClick={handleDocumentClick}
              style={{ cursor: "pointer", borderLeft: "4px solid #7A5DF6" }}
            >
              Document # {document.documentNumber}
            </a>
          ))
        )}

        {stackSchema && (
          <div className="mt-6 p-4 bg-indigo-100 rounded-lg shadow-inner">
            <h4 className="text-indigo-700 font-semibold mb-2">Stack Schema</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
              {Object.entries(stackSchema).map(([fieldName, fieldType]) => (
                <li key={fieldName}>
                  <strong className="text-indigo-600">{fieldName}:</strong>{" "}
                  {fieldType}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default Stacks;
