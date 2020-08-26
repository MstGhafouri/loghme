import React from "react";
import { connect } from "react-redux";
import { fetchRestaurants, RestaurantsType, searchParamsType } from "../../../../redux/actions";
import { StateStore } from "../../../../redux/reducers";
import CustomTitle from "../../../ui/customTitle";
import CardList from "./CardList";
import Pagination from "../../../pagination";

export interface RestaurantsProps {
  restaurants: RestaurantsType[];
  totalRestaurants: number;
  searchParams: searchParamsType;
  fetchRestaurants: Function;
}

class Restaurants extends React.Component<RestaurantsProps> {
  perPage = 16;

  componentDidMount() {
    if (!this.props.restaurants.length) {
      this.props.fetchRestaurants();
    }
  }

  onPageClick = (page: number) => {
    const {
      fetchRestaurants,
      searchParams: { restaurantName, foodName }
    } = this.props;

    fetchRestaurants({ page, restaurantName, foodName });
    window.location.href = "/#section_restaurants";
  };

  render() {
    const { restaurants, totalRestaurants } = this.props;
    const pageCount = Math.ceil(totalRestaurants / this.perPage);
    return (
      <section className="section-restaurants" id="section_restaurants">
        <CustomTitle text="رستوران‌ها" classNm="mb-5" />
        <CardList restaurants={restaurants} />
        {!restaurants.length && (
          <p className="text-center u-font-size-default">لیست رستوران‌ها خالی می‌باشد</p>
        )}
        <Pagination pageCount={pageCount} perPage={this.perPage} onPageClick={this.onPageClick} />
      </section>
    );
  }
}

type restaurantsStateType = {
  restaurants: RestaurantsType[];
  totalRestaurants: number;
  searchParams: searchParamsType;
};

const mapStateToProps = ({
  restaurants,
  totalRestaurants,
  searchParams
}: StateStore): restaurantsStateType => {
  return { restaurants, totalRestaurants, searchParams };
};

export default connect(mapStateToProps, { fetchRestaurants })(Restaurants);
