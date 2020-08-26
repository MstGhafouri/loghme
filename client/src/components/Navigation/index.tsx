import React from "react";
import { connect } from "react-redux";
import { handleModals, User, logout } from "../../redux/actions";
import { Logo } from "../ui/icons";
import { CustomLink } from "../ui/buttons";
import { StateStore } from "../../redux/reducers";
import Popup from "../Popup/index.";
import history from "../../history";
import Cart from "../Cart";
import { toPersianDigits } from "./../../util/index";

export interface NavigationProps {
  currentUser: User | null;
  handleModals: typeof handleModals;
  logout: Function;
  clickedModal: { name: string; open: boolean };
  itemsCount: number;
}

export interface NavigationState {}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  componentDidMount() {
    history.listen(this.onRouteChange);
  }
  onRouteChange = () => {
    this.setState({});
  };

  renderNavItems = () => {
    const { handleModals, itemsCount, currentUser, logout } = this.props;
    const { pathname } = history.location;
    const logoItem = pathname !== "/" && <Logo isLink={true} classNm="navigation__logo" />;
    return (
      <React.Fragment>
        {currentUser ? (
          <React.Fragment>
            <li className="navigation__item nav-item" id="navigation-exit">
              <CustomLink linkTo="/" onClick={() => logout()}>
                خروج
              </CustomLink>
            </li>
            {pathname !== "/profile" && (
              <li className="navigation__item nav-item">
                <CustomLink linkTo="/profile">حساب کاربری</CustomLink>
              </li>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {pathname !== "/signin" && (
              <li className="navigation__item nav-item">
                <CustomLink linkTo="/signin">ورود</CustomLink>
              </li>
            )}
            {pathname !== "/signup" && (
              <li className="navigation__item nav-item">
                <CustomLink linkTo="/signup">ثبت‌نام</CustomLink>
              </li>
            )}
          </React.Fragment>
        )}

        <li className="navigation__item nav-item mr-auto" id="navigation-cart">
          <CustomLink linkTo="#" onClick={e => handleModals(true, "cart")}>
            <i className="flaticon-smart-cart"></i>
            {itemsCount !== 0 && (
              <span className="badge badge-pill badge-dark">{toPersianDigits(itemsCount)}</span>
            )}
          </CustomLink>
        </li>
        <li className="navigation__item nav-item">{logoItem}</li>
      </React.Fragment>
    );
  };

  renderNav = () => {
    const { clickedModal } = this.props;

    return (
      <React.Fragment>
        <nav className="navigation py-2 px-5">
          <ul className="navigation__list nav flex-row-reverse">{this.renderNavItems()}</ul>
        </nav>
        <Popup
          open={clickedModal.open && clickedModal.name === "cart"}
          name="cart"
          overLayClassNm="cart"
          contentClassNm="cart__content"
        >
          <Cart />
        </Popup>
      </React.Fragment>
    );
  };

  render() {
    return this.renderNav();
  }
}

type StateToPropsType = {
  clickedModal: { open: boolean; name: string };
  currentUser: User | null;
  itemsCount: number;
};

const mapStateToProps = ({
  clickedModal,
  cart: { cartItems },
  user: { currentUser }
}: StateStore): StateToPropsType => {
  return {
    clickedModal,
    currentUser,
    itemsCount: cartItems.reduce((acc, item) => acc + item.quantity!, 0)
  };
};

export default connect(mapStateToProps, { handleModals, logout })(Navigation);
