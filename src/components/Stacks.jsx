import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

function Stacks({ stackName }) {
  const [documents, setDocuments] = useState([]);
  const [stackSchema, setStackSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uiError, setUiError] = useState(null);

  const getStackMetadata = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/stack/${stackName}`
      );
      setStackSchema(response.data.fieldSchema);
      return response.data.fieldSchema;
    } catch (error) {
      console.error("Error fetching stack metadata:", error);
      setUiError(
        "Could not load stack schema. Please check backend connection."
      );
      setIsLoading(false);
      return null;
    }
  }, [stackName]);

  const getDocuments = useCallback(
    async (schema) => {
      if (!schema) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/stack/${stackName}/documents`
        );

        setDocuments(response.data);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "An unknown error occurred.";

        console.error(`Error fetching documents:`, message);
        setUiError(`Failed to load documents: ${message}`);
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    },
    [stackName]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setUiError(null);

      const schema = await getStackMetadata();
      if (schema) {
        await getDocuments(schema);
      }
    };

    fetchData();
  }, [getStackMetadata, getDocuments]);

  const schemaKeys = stackSchema ? Object.keys(stackSchema) : [];
  const tableHeaders = ["Document #", ...schemaKeys];

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading Stack Data...</p>
      </div>
    );
  }

  return (
    <div
      data-testid="stack-container"
      className="p-4 rounded-lg shadow-lg"
      style={{ backgroundColor: "#FFFFFF", minHeight: "100%" }}
    >
      <h3
        className="card-title mb-4"
        style={{
          color: "#7A5DF6",
          fontSize: "1.5rem",
          fontWeight: "bold",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Documents in Stack: {stackName}
      </h3>

      {uiError && (
        <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {uiError}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="alert alert-info text-center">
          No documents found in this stack.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead
              className="table-primary"
              style={{ backgroundColor: "#7A5DF6", color: "white" }}
            >
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.documentNumber}>
                  <th scope="row" className="fw-bold">
                    {doc.documentNumber}
                  </th>
                  {schemaKeys.map((key) => {
                    let customDataObj = null;
                    try {
                      if (
                        doc.customData &&
                        typeof doc.customData === "string"
                      ) {
                        customDataObj = JSON.parse(doc.customData);
                      } else if (doc.customData) {
                        customDataObj = doc.customData;
                      }
                    } catch (e) {
                      console.error(
                        "Error parsing customData for document #",
                        doc.documentNumber,
                        e
                      );
                    }

                    const normalizedKey = key.toLowerCase();
                    let value = null;

                    if (customDataObj) {
                      value = customDataObj[normalizedKey];

                      if (value === undefined || value === null) {
                        value = customDataObj[key];
                      }
                    }

                    return (
                      <td key={key}>
                        {value !== undefined && value !== null
                          ? String(value)
                          : "N/A"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {stackSchema && (
        <div className="mt-6 p-4 bg-indigo-100 rounded-lg shadow-inner">
          <h4 className="text-indigo-700 font-semibold mb-2">
            Stack Schema Reference
          </h4>
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
  );
}

export default Stacks;
