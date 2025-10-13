import React from "react";

const Span = ({ children, top }) => {
  return (
    <span style={{ verticalAlign: top ? "top" : "sub", fontSize: "0.8em" }}>
      {children}
    </span>
  );
};

export default Span;
