import React from "react";

export interface CustomTitleProps {
  text: string;
  classNm?: string;
  textStyle?: string;
}

const CustomTitle: React.SFC<CustomTitleProps> = ({ classNm, text, textStyle }) => {
  return (
    <div className={`text-center ${classNm}`}>
      <h2 className={`heading-primary ${textStyle}`}>{text}</h2>
    </div>
  );
};

export default CustomTitle;
