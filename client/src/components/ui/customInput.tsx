import React from "react";

export interface CustomInputProps {
  inputClassNm: string;
  type: "text" | "password" | "email" | "number";
  placeholder: string;
  input: any;
}

const CustomInput: React.SFC<CustomInputProps> = ({ inputClassNm, type, placeholder, input }) => {
  return (
    <input
      {...input}
      type={type}
      placeholder={placeholder}
      className={inputClassNm}
      autoComplete="off"
    />
  );
};

CustomInput.defaultProps = {
  inputClassNm: "register__input form-control",
  type: "text"
};

export default CustomInput;
