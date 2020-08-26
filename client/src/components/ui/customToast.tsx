import React from "react";

export interface CustomToastProps {
  header?: string;
  message: string;
}

const CustomToast: React.SFC<CustomToastProps> = ({ header, message }) => {
  return (
    <div>
      <h2>{header}</h2>
      <h4>{message}</h4>
    </div>
  );
};

export default CustomToast;
