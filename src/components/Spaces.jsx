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
  const [newStackName, setNewStackName] = useState("");
  const [newStackSchema, setNewStackSchema] = useState([
    { name: "Name", type: "string" },
  ]);
  const [nameError, setNameError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStackName, setSelectedStackName] = useState(null);

  const inputRef = useRef(null);

  const handleCloseModal = () => {
    setNewStackName("");
    setNewStackSchema([{ name: "Name", type: "string" }]);
    setNameError("");

    setShowModal(false);
  };

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

  const postStacks = useCallback(async () => {
    const name = newStackName.trim();

    if (!name) {
      alert("Stack name cannot be blank.");
      return;
    }

    const formattedSchema = newStackSchema.reduce((acc, field) => {
      if (field.name.trim()) {
        acc[field.name.trim()] = field.type;
      }
      return acc;
    }, {});

    if (Object.keys(formattedSchema).length === 0) {
      alert("Please define at least one field for the stack schema.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/stack", {
        stackName: name,
        spaceName: spaceName,
        fieldSchema: formattedSchema,
      });

      console.log("SUCCESS: Stack created", response.data);

      setNewStackName("");
      setNewStackSchema([{ name: "Name", type: "string" }]);
      setShowModal(false);

      getStacks();
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "An unknown server error.";

      console.error(`POST Error (${status}):`, message);
      alert(`Error adding stack: ${message}`);
    }
  }, [newStackName, newStackSchema, setNewStackName, getStacks]);

  const validateStackName = (name) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("");
      return false;
    }

    const exists = stacks.some(
      (stack) => stack.stackName.toLowerCase() === trimmedName.toLowerCase()
    );

    if (exists) {
      setNameError(`Stack already exists with name: "${trimmedName}"`);
      return true;
    }

    setNameError("");
    return false;
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setNewStackName(name);
    validateStackName(name);
  };

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

  const handleAddField = () => {
    setNewStackSchema((prev) => [...prev, { name: "", type: "string" }]);
  };

  const handleRemoveField = (index) => {
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
            >
              + Add Stack
            </button>

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
                <div className="mb-3">
                  <label className="form-label fw-bold">Stack Name</label>
                  <input
                    type="text"
                    className={`form-control ${nameError ? "is-invalid" : ""}`}
                    placeholder="e.g. Employees"
                    value={newStackName}
                    onChange={handleNameChange}
                  />
                  {nameError && (
                    <div className="invalid-feedback d-block text-danger mt-1">
                      {nameError}
                    </div>
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

const FIELD_TYPES = ["string", "number", "boolean", "date"];

export default Spaces;
