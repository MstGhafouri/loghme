import React from "react";

export interface LoaderProps {
  loading: boolean;
  position?: "fixed" | "absolute";
}

const Loader: React.SFC<LoaderProps> = ({ loading, position }) => {
  if (loading)
    return (
      <div className="loading-container" style={{ position: position }}>
        <div className="loader"></div>
      </div>
    );
  return null;
};

Loader.defaultProps = {
  loading: false,
  position: "absolute"
};

export default Loader;
