function Spaces({ spaceName }) {
  return (
    <div data-testid="space-container" className="p-4" style={{ backgroundColor: "#EDEDED", height: "100%" }}>
      <h2 style={{ color: "#7A5DF6" }}>{spaceName} Space</h2>
      <p>This is the Spaces view where you will see the stacks inside the Space.</p>
    </div>
  );
}

export default Spaces;