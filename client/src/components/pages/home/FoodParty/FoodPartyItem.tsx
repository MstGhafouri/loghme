import React from "react";
import { connect } from "react-redux";
import { handleModals } from "../../../../redux/actions";
import { StateStore } from "../../../../redux/reducers";
import { CustomBtn } from "../../../ui/buttons";
import { FoodPartyType } from "../../../../redux/actions/types";
import InfoBox from "../../../ui/infoBox";
import Popup from "../../../Popup/index.";
import FoodModal from "../../../ui/foodModal";
import { toPersianDigits } from "./../../../../util/index";

export interface FoodPartyItemProps extends FoodPartyType {
  restaurantName: string;
  restaurantId: string;
  handleModals: typeof handleModals;
  clickedModal: { name: string; open: boolean };
}

class FoodPartyItem extends React.Component<FoodPartyItemProps> {
  rand = Math.random();
  render() {
    const {
      name,
      count,
      image,
      popularity,
      price,
      oldPrice,
      restaurantName,
      handleModals,
      clickedModal
    } = this.props;
    return (
      <React.Fragment>
        <div className="card foodParty__card">
          <div className="card-body foodParty__card--content">
            <div className="foodParty__card--info mb-4">
              <div className="pr-3 py-3">
                <h2 className="card-title">{name}</h2>
                <h4>
                  <span>{popularity > 0.6 ? "۵" : "۴"}</span> ⭐
                </h4>
              </div>
              <div className="footParty__card--img-box">
                <img src={image} alt={name} className="foodParty__card--img" />
              </div>
            </div>
            <div className="foodParty__card--price mb-3">
              <h4 className="foodParty__card--cur-price pr-2">
                {toPersianDigits(price.toLocaleString())}
              </h4>
              <h4 className="foodParty__card--old-price text-left pl-5">
                <span className="inner">{toPersianDigits(oldPrice.toLocaleString())}</span>
              </h4>
            </div>
            <div className="foodParty__card--cta">
              <CustomBtn
                type="button"
                text="خرید"
                classNm={`${count === 0 ? "u-bg-grey-light text-white disabled" : "animated-btn--light"}`}
                onClick={e => handleModals(true, this.rand.toString())}
                disabled={count === 0 ? true : false}
              />
              <InfoBox textStyle="text-muted" classNm="text-center ml-4 card-box">
                {count !== 0 ? `موجودی: ${toPersianDigits(count)}` : "ناموجود"}
              </InfoBox>
            </div>
          </div>
          <div className="card-footer p-2 foodParty__card--footer">
            <p className="card-text text-center">{restaurantName}</p>
          </div>
        </div>

        <Popup
          open={clickedModal.open && clickedModal.name === this.rand.toString()}
          name={this.rand.toString()}
        >
          <FoodModal {...this.props} type="foodParty" maxCount={count} />
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

export default connect(mapStateToProps, { handleModals })(FoodPartyItem);
