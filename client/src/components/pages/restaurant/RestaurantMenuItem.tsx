import React from "react";
import { connect } from "react-redux";
import { handleModals, FoodType } from "../../../redux/actions";
import { CustomBtn } from "../../ui/buttons";
import { StateStore } from "../../../redux/reducers";
import { toPersianDigits } from "./../../../util";
import Popup from "../../Popup/index.";
import FoodModal from "../../ui/foodModal";

export interface RestaurantMenuItemProps extends FoodType {
  handleModals: typeof handleModals;
  clickedModal: { name: string; open: boolean };
  restaurantName: string;
  restaurantId: string;
  type: "food" | "foodParty";
}

class RestaurantMenuItem extends React.Component<RestaurantMenuItemProps> {
  render() {
    const { image, name, price, popularity, handleModals, clickedModal } = this.props;
    return (
      <React.Fragment>
        <div className="card restaurants__card">
          <img className="card-img-top restaurant__card--img" src={image} alt="restaurant" />
          <div className="food-popularity justify-content-center">
            <p className="mb-0 ml-3">{name}</p>
            <h4>
              <span>{popularity > 0.7 ? "۵" : "۴"}</span> ⭐
            </h4>
          </div>
          <h4 className="text-center text-muted mb-4 mt-3">{`${toPersianDigits(
            price.toLocaleString()
          )} تومان`}</h4>
          <div className="card-footer p-2 bg-white border-0 restaurants__card--footer">
            <CustomBtn
              classNm="animated-btn--gold w-75 mx-auto"
              text="افزودن به سبد خرید"
              onClick={e => handleModals(true, name)}
            />
          </div>
        </div>

        <Popup open={clickedModal.open && clickedModal.name === name} name={name}>
          <FoodModal {...this.props} />
        </Popup>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  clickedModal
}: StateStore): { clickedModal: { open: boolean; name: string } } => {
  return { clickedModal };
};

export default connect(mapStateToProps, { handleModals })(RestaurantMenuItem);
