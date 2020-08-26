import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { fetchRestaurant, RestaurantsType } from "../../../redux/actions";
import { StateStore } from "../../../redux/reducers";
import RestaurantHeader from "./RestaurantHeader";
import Cart from "../../Cart";
import RestaurantMenuList from "./RestaurantMenuList";
import Loader from "../../Loader";
import { createLoadingSelector } from "../../../redux/reducers/loading";

interface MatchParams {
  slug: string;
}

export interface RestaurantProps extends RouteComponentProps<MatchParams> {
  fetchRestaurant: Function;
  restaurant: RestaurantsType;
  isFetching: boolean;
}

class Restaurant extends React.Component<RestaurantProps> {
  componentDidMount() {
    document.title = "رستوران";
    const { fetchRestaurant, match } = this.props;
    fetchRestaurant(match.params.slug);
  }

  render() {
    const { restaurant, isFetching } = this.props;
    if (restaurant.slug && !isFetching)
      return (
        <React.Fragment>
          <RestaurantHeader logo={restaurant.logo} />
          <section className="restaurant-menu">
            <h1 className="heading-secondary text-center font-weight-bold u-margin-bottom-big">
              {restaurant.name}
            </h1>

            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-3">&nbsp;</div>
                <div className="col-lg-9">
                  <div className="text-center mb-5" id="food-menu-heading">
                    <h2 className="heading-primary">منو غذا</h2>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-3 order-lg-1 order-2 mt-5 mt-lg-0 restaurant-menu__cart">
                  <div className="cart">
                    <div className="cart__content">
                      <Cart />
                    </div>
                  </div>
                </div>

                <div className="col-lg-9 pr-lg-0 order-lg-2 order-1">
                  <div className="container-fluid restaurant__container">
                    <RestaurantMenuList restaurant={restaurant} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </React.Fragment>
      );
    else return <Loader loading={isFetching} />;
  }
}

const loadingSelector = createLoadingSelector(["GET_RESTAURANT"]);

const mapStateToProps = (
  state: StateStore
): { restaurant: RestaurantsType; isFetching: boolean } => {
  const { restaurant } = state;
  return { restaurant, isFetching: loadingSelector(state) };
};

export default connect(mapStateToProps, { fetchRestaurant })(withRouter(Restaurant));
