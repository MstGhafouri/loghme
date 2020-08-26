import React from "react";
import { Logo } from "../../../ui/icons";
import Heading from "./Heading";
import SearchBox from "./SearchBox";

export interface HeaderProps {}

class Header extends React.Component<HeaderProps> {
  heading = "اولین و بزرگ ترین وب سایت سفارش آنلاین غذا در دانشگاه تهران";

  render() {
    return (
      <header className="header">
        <div className="header__logo-box container text-center">
          <Logo isLink={false} classNm="header__logo mb-4 mb-sm-5" />
          <Heading letters={this.heading} />
        </div>
        <SearchBox />
      </header>
    );
  }
}

export default Header;
