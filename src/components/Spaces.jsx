import { useState, useEffect, useRef, useCallback } from "react";
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
  const [allStackNames, setAllStackNames] = useState([]);
  const [newStackName, setNewStackName] = useState("");
  const [newStackSchema, setNewStackSchema] = useState([
    { name: "Name", type: "string" },
  ]);
  const [nameError, setNameError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStackName, setSelectedStackName] = useState(null);
  const [uiError, setUiError] = useState(null);

  const [globalNameFetchFailed, setGlobalNameFetchFailed] = useState(false);

  const inputRef = useRef(null);

  const clearError = () => setUiError(null);

  const handleCloseModal = () => {
    setNewStackName("");
    setNewStackSchema([{ name: "Name", type: "string" }]);
    setNameError("");
    clearError();
    setShowModal(false);
  };

  const getStacks = useCallback(async () => {
    clearError();
    try {
      const response = await axios.get(
        `http://localhost:8080/${spaceName}/stacks`
      );
      setStacks(response.data);
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";

      console.error(
        `API Error (${status || "Network"}) for space stacks:`,
        message
      );
      if (status >= 500) {
        setUiError(`Server Error: Could not load stacks for ${spaceName}.`);
      } else if (status === 404) {
        setUiError(
          `API 404: The stack endpoint for ${spaceName} was not found. Check if your backend server is running and the path is correct.`
        );
      } else if (status >= 400) {
        setUiError(`Client Error: Invalid request for stacks in ${spaceName}.`);
      } else {
        setUiError(
          "Network Error: Could not connect to the stack server. Check if your API is running and CORS is configured."
        );
      }
    }
  }, [setStacks, spaceName]);

  const getGlobalStackNames = useCallback(async () => {
    setGlobalNameFetchFailed(false);

    try {
      const response = await axios.get("http://localhost:8080/stacks");

      setAllStackNames(response.data);
    } catch (error) {
      console.warn(
        "Global stack name validation data could not be fetched (404/CORS). Global uniqueness check is disabled.",
        error
      );
      setAllStackNames([]);
      setGlobalNameFetchFailed(true);
    }
  }, []);

  const postStacks = useCallback(async () => {
    const name = newStackName.trim();
    clearError();

    if (validateStackName(name)) {
      setUiError("Please fix the stack name error before submitting.");
      return;
    }

    if (!name) {
      setUiError("Stack name cannot be blank.");
      return;
    }

    const formattedSchema = newStackSchema.reduce((acc, field) => {
      if (field.name.trim()) {
        acc[field.name.trim()] = field.type;
      }
      return acc;
    }, {});

    if (Object.keys(formattedSchema).length === 0) {
      setUiError("Please define at least one field for the stack schema.");
      return;
    }

    try {
      const payload = {
        stackName: name,
        spaceName: spaceName,
        fieldSchema: formattedSchema,
      };

      const response = await axios.post("http://localhost:8080/stack", payload);

      console.log("SUCCESS: Stack created", response.data);

      setNewStackName("");
      setNewStackSchema([{ name: "Name", type: "string" }]);
      setShowModal(false);

      getStacks();
      getGlobalStackNames();
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "An unknown server error.";

      console.error(`POST Error (${status}):`, message);
      setUiError(`Failed to create stack: ${message}`);
    }
  }, [newStackName, newStackSchema, getStacks, getGlobalStackNames, spaceName]);

  const validateStackName = (name) => {
    const trimmedName = name.trim();
    let errorFound = false;

    if (!trimmedName) {
      setNameError("");
      return false;
    }

    const exists = allStackNames.some(
      (stackName) => stackName.toLowerCase() === trimmedName.toLowerCase()
    );

    if (exists) {
      setNameError(
        `Stack already exists globally with name: "${trimmedName}". Stack names must be unique across all spaces.`
      );
      errorFound = true;
    } else {
      setNameError("");
    }

    return errorFound;
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setNewStackName(name);
    validateStackName(name);
  };

  useEffect(() => {
    getStacks();
    getGlobalStackNames();
  }, [getStacks, getGlobalStackNames]);

  useEffect(() => {
    setSelectedStackName(null);
  }, [spaceName]);

  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);

  useEffect(() => {
    if (uiError) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [uiError]);

  const handleClick = (stackName) => {
    setSelectedStackName(stackName);
  };

  const handleBack = () => {
    setSelectedStackName(null);
  };

  const handleAddField = () => {
    setNewStackSchema((prev) => [...prev, { name: "", type: "string" }]);
  };

  const handleRemoveField = (index) => {
    if (newStackSchema.length <= 1) return;
    setNewStackSchema((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, key, value) => {
    setNewStackSchema((prev) =>
      prev.map((field, i) => (i === index ? { ...field, [key]: value } : field))
    );
  };

  const chunkedStacks = chunkArray(stacks, 3);

  const isButtonDisabled =
    newStackName.trim() === "" ||
    newStackSchema.some((f) => !f.name.trim()) ||
    !!nameError;

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

            <button
              className="btn btn-sm btn-primary mb-3"
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: "#7A5DF6", borderColor: "#7A5DF6" }}
            >
              + Add Stack
            </button>

            {uiError && (
              <div
                className="alert alert-danger p-2 mb-3 d-flex justify-content-between align-items-center"
                role="alert"
              >
                <small>{uiError}</small>
                <button
                  type="button"
                  className="btn-close ms-2"
                  onClick={clearError}
                  aria-label="Close"
                ></button>
              </div>
            )}

            <div
              className="border border-secondary-subtle"
              style={{
                maxHeight: "calc(100vh - 170px)",
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
                            className="p-3 text-dark text-decoration-none d-block transition-all hover:bg-gray-200"
                            onClick={(e) => {
                              e.preventDefault();
                              handleClick(stack.stackName);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {stack.stackName}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {stacks.length === 0 && !uiError && (
                  <div className="col-12 p-4 text-center text-secondary">
                    No stacks found in this space.
                  </div>
                )}
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
              className="btn btn-sm btn-primary mb-3"
              onClick={handleBack}
              style={{ backgroundColor: "#7A5DF6", borderColor: "#7A5DF6" }}
            >
              &larr; Back to Stacks
            </button>
            <Stacks stackName={selectedStackName} />
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Create New Stack in "{spaceName}"
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {globalNameFetchFailed && (
                  <div
                    className="alert alert-warning p-2 mb-3"
                    role="alert"
                    style={{ fontSize: "0.875em" }}
                  >
                    <small>
                      **API Warning:** Global stack uniqueness validation is
                      disabled because the endpoint
                      `http://localhost:8080/stacks` failed to load (404 Not
                      Found or CORS issue). Please ensure your backend server is
                      running with the required `GET /stacks` endpoint.
                    </small>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-bold">Stack Name</label>
                  <input
                    ref={inputRef}
                    type="text"
                    className={`form-control ${nameError ? "is-invalid" : ""}`}
                    placeholder="e.g. Employees"
                    value={newStackName}
                    onChange={handleNameChange}
                  />
                  {nameError && (
                    <div className="invalid-feedback d-block">{nameError}</div>
                  )}
                </div>

                <h6 className="mt-4 border-bottom pb-2">Define Field Schema</h6>
                {newStackSchema.map((field, index) => (
                  <div key={index} className="row g-2 mb-2 align-items-center">
                    <div className="col-5">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Field Name (e.g., Email)"
                        value={field.name}
                        onChange={(e) =>
                          handleFieldChange(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-5">
                      <select
                        className="form-select form-select-sm"
                        value={field.type}
                        onChange={(e) =>
                          handleFieldChange(index, "type", e.target.value)
                        }
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    <div className="col-2 text-end">
                      {newStackSchema.length > 1 && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveField(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  className="btn btn-sm btn-outline-success mt-2"
                  onClick={handleAddField}
                >
                  + Add Field
                </button>
                {uiError && (
                  <div className="alert alert-warning mt-3 p-2">
                    <small>{uiError}</small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${
                    isButtonDisabled
                      ? "btn-light text-secondary border"
                      : "btn-primary"
                  }`}
                  onClick={postStacks}
                  disabled={isButtonDisabled}
                  style={{
                    backgroundColor: isButtonDisabled ? undefined : "#7A5DF6",
                    borderColor: isButtonDisabled ? undefined : "#7A5DF6",
                  }}
                >
                  Create Stack
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Spaces;
