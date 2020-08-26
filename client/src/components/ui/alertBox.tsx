import React from "react";

export interface AlertBoxProps {
  message: string;
}

const AlertBox: React.SFC<AlertBoxProps> = ({ message }) => {
  return <h6 className="alert alert-warning alert-box">{message}</h6>;
};

export default AlertBox;
