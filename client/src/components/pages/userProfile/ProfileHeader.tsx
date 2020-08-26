import React from "react";
import { User } from "../../../redux/actions/types";
import { toPersianDigits } from "./../../../util/index";

export interface ProfileHeaderProps {
  currentUser: User;
}

const ProfileHeader: React.SFC<ProfileHeaderProps> = ({ currentUser }) => {
  return (
    <header className="profile__header">
      <div className="profile__header--content container-fluid">
        <div className="row">
          <div className="col-md-8 col-sm-7 profile__user-box">
            <i className="flaticon-account"></i>
            <h1 className="profile__name">
              {currentUser!.firstName} {currentUser!.lastName}
            </h1>
          </div>
          <div className="col-md-4 col-sm-5">
            <ul className="profile__info-list">
              <li className="profile__info-item">
                <i className="flaticon-phone"></i>
                <p>{toPersianDigits(`${currentUser!.phoneNumber}`)}</p>
              </li>
              <li className="profile__info-item">
                <i className="flaticon-mail"></i>
                <p>{currentUser!.email}</p>
              </li>
              <li className="profile__info-item">
                <i className="flaticon-card"></i>
                <p>{`${toPersianDigits(currentUser!.credit.toLocaleString())} تومان`}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
