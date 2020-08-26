import React from "react";

export interface CustomTableProps {
  classNm?: string;
  tHeader: JSX.Element | JSX.Element[];
  tBody: JSX.Element | JSX.Element[];
}

const CustomTable: React.SFC<CustomTableProps> = ({ classNm, tHeader, tBody }) => {
  return (
    <table className={`table table-bordered table-hover ${classNm}`}>
      <thead>{tHeader}</thead>
      <tbody>{tBody}</tbody>
    </table>
  );
};

export default CustomTable;
