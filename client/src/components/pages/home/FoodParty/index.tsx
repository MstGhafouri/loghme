import React from "react";
import CustomTitle from "../../../ui/customTitle";
import FoodPartyList from "./FoodPartyList";
import Timer from "../../../Timer";

export interface FoodPartyProps {}

class FoodParty extends React.Component<FoodPartyProps> {
  render() {
    return (
      <section className="section-foodParty">
        <CustomTitle text="جشن غذا !" classNm="mb-4" />
        <Timer />
        <FoodPartyList />
      </section>
    );
  }
}

export default FoodParty;
