import React from "react";
import { connect } from "react-redux";
import { StateStore } from "../../../redux/reducers";
import { User, fetchUserOrders } from "../../../redux/actions";
import ProfileHeader from "./ProfileHeader";
import CreditTab from "./CreditTab";
import OrdersTab from "./OrdersTab";

export interface UserProfileProps {
  currentUser: User | null;
  fetchUserOrders: Function;
}

export interface UserProfileState {}

class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  componentDidMount() {
    document.title = `حساب کاربری | ${this.props.currentUser?.firstName}`;
  }

  renderContent = () => {
    const { currentUser, fetchUserOrders } = this.props;
    return (
      <React.Fragment>
        <ProfileHeader currentUser={currentUser!} />
        <section className="profile-section">
          <div className="container profile__content">
            <input type="radio" id="creditTab" name="tab" defaultChecked />
            <input type="radio" id="ordersTab" name="tab" />
            <div className="profile__tabs">
              <ul className="profile__tabs-list">
                <li className="profile__tabs-item item1">
                  <label htmlFor="ordersTab" onClick={() => fetchUserOrders(currentUser!?.id)}>
                    سفارش‌ها
                  </label>
                </li>
                <li className="profile__tabs-item item2">
                  <label htmlFor="creditTab">افزایش اعتبار</label>
                </li>
              </ul>
            </div>

            <div className="profile__tabs-body">
              <CreditTab />
              <OrdersTab />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  };

  render() {
    return this.renderContent();
  }
}

type ProfileStateType = {
  currentUser: User | null;
};

const mapStateToProps = ({ user: { currentUser } }: StateStore): ProfileStateType => {
  return { currentUser };
};

export default connect(mapStateToProps, { fetchUserOrders })(UserProfile);
