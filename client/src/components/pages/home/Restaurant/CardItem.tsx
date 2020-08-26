import React from "react";
import { CustomLink } from "../../../ui/buttons";

export interface CardItemProps {
  name: string;
  logo: string;
  slug: string;
}

const CardItem: React.SFC<CardItemProps> = ({ name, logo, slug }: CardItemProps) => {
  return (
    <div className="col-lg-3 col-md-6 mb-lg-4 mb-5">
      <div className="card restaurants__card">
        <img className="card-img-top restaurants__card--img" src={logo} alt="restaurant" />
        <h3 className="text-center mb-4 restaurants__card--name">{name}</h3>
        <div className="card-footer p-2 bg-white border-0 restaurants__card--footer">
          <CustomLink
            linkTo={`/restaurant/${slug}`}
            classNm="btn animated-btn animated-btn--gold w-50 mx-auto"
          >
            نمایش منو
          </CustomLink>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
