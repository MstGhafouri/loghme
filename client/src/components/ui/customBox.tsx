import React from "react";

export interface CustomBoxProps {
  sectionClassNm: string;
  headingText: string;
  children: JSX.Element | JSX.Element[];
}

const CustomBox: React.SFC<CustomBoxProps> = ({ sectionClassNm, headingText, children }) => {
  return (
    <section className={sectionClassNm}>
      <div className="content-box">
        <div className="content-box__heading">
          <h1>{headingText}</h1>
        </div>
        {children}
      </div>
    </section>
  );
};

export default CustomBox;
