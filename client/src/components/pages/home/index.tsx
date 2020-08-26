import React from "react";
import Header from "./Header";
import FoodParty from "./FoodParty";
import Restaurants from "./Restaurant";

export interface HomeProps {}

export interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
  componentDidMount() {
    document.title = "لقمه";
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <FoodParty />
        <Restaurants />
      </React.Fragment>
    );
  }
}

export default Home;
