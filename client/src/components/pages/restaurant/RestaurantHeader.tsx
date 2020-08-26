import React from "react";

export interface RestaurantHeaderProps {
  logo: string;
}

const RestaurantHeader: React.SFC<RestaurantHeaderProps> = ({ logo }) => {
  return (
    <header className="restaurant__header">
      <div className="restaurant__header--content">
        <figure className="restaurant__header--fig">
          <img src={logo} alt="restaurant" className="restaurant__header--img img-thumbnail" />
        </figure>
      </div>
    </header>
  );
};

export default RestaurantHeader;
