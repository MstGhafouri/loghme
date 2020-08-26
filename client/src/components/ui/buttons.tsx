import React from "react";
import { Link } from "react-router-dom";

export interface CustomBtnProps {
  text: string | JSX.Element;
  type?: "submit" | "reset" | "button";
  classNm: string;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export interface CustomLinkProps {
  linkTo: string;
  classNm?: string;
  onClick?: (ev: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const CustomBtn: React.SFC<CustomBtnProps> = ({
  type,
  classNm,
  onClick,
  text,
  disabled
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`btn animated-btn ${classNm}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export const CustomLink: React.SFC<CustomLinkProps> = props => {
  return (
    <Link
      to={props.linkTo}
      className={props.classNm || "navigation__link nav-link"}
      onClick={props.onClick}
    >
      {props.children}
    </Link>
  );
};
