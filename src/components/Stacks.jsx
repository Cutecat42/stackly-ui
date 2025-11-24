function Stacks({ stackName }) {
  return (
    <>
      <div
        data-testid="stack-container"
        className=""
        style={{ backgroundColor: "#EDEDED", height: "100%" }}
      >
        <h2 className="mb-3" style={{ color: "#7A5DF6" }}>
          {stackName} Stack
        </h2>
      </div>
    </>
  );
}

export default Stacks;
