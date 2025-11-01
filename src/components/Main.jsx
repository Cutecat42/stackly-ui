import React, { useState } from "react";
import Spaces from "./Spaces.jsx";

function Main({ activeSpace }) {
  const showSpaces = activeSpace !== null;


  return (
    <div className="h-100">
      {showSpaces ? (
        <Spaces spaceName={activeSpace}/>
      ) : (
        <div className="p-4" style={{ backgroundColor: "#F7F8FA", height: "100%" }}>
          <h2 style={{ color: "#1A1A1A" }}>Queue</h2>
          <p style={{ color: "#6A6A6A" }}>
            This is where your documents will appear to add to a Space.
          </p>
        </div>
      )}
    </div>
  );
}

export default Main;