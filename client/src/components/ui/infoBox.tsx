import React from "react";

export interface InfoBoxProps {
  children: JSX.Element | string | number;
  classNm: string;
  textStyle?: string;
}

const InfoBox: React.SFC<InfoBoxProps> = props => {
  return (
    <div className={`text-center ${props.classNm}`}>
      <p className={props.textStyle}>{props.children}</p>
    </div>
  );
};

export default InfoBox;
