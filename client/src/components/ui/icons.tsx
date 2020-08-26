import React from "react";
import { Link } from "react-router-dom";

import logo from "../../resources/img/logo.png";

export interface LogoProps {
  isLink: boolean;
  linkTo?: string;
  classNm: string;
}

export const Logo: React.SFC<LogoProps> = props => {
  const template = <img src={logo} alt="logo" className={props.classNm}></img>;
  if (props.isLink) return <Link to={props.linkTo || "/"}>{template}</Link>;
  return template;
};
