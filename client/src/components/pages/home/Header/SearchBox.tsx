import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, InjectedFormProps, reset } from "redux-form";
import { CustomBtn } from "../../../ui/buttons";
import { fetchRestaurants } from "../../../../redux/actions";
import { Dispatch } from "redux";
import { StateStore } from "../../../../redux/reducers";
import { createLoadingSelector } from "../../../../redux/reducers/loading";
import Loader from "../../../Loader";

interface CustomProps {
  fetchRestaurants: Function;
  isFetching: boolean;
}

interface OwnProps {
  food_name?: string;
  restaurant_name?: string;
}

class SearchBox extends React.Component<CustomProps & InjectedFormProps<{}, CustomProps>> {
  renderInput = ({ input, placeholder }: any) => {
    return (
      <div className="col pl-0">
        <input
          {...input}
          type="text"
          className="form-control"
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
    );
  };

  onSubmit = ({ restaurant_name, food_name }: OwnProps) => {
    this.props.fetchRestaurants({ restaurantName: restaurant_name, foodName: food_name });
  };

  render() {
    return (
      <React.Fragment>
        <div className="header__search-box container">
          <form
            className="header__search-form mx-auto"
            onSubmit={this.props.handleSubmit(this.onSubmit)}
          >
            <div className="row bg-white py-3 px-4">
              <Field name="food_name" component={this.renderInput} placeholder="نام غذا" />
              <Field
                name="restaurant_name"
                component={this.renderInput}
                placeholder="نام رستوران"
              />
              <div className="col">
                <CustomBtn type="submit" classNm="animated-btn--gold h-100" text="جست‌وجو" />
              </div>
            </div>
          </form>
        </div>
        <Loader loading={this.props.isFetching} position="fixed" />
      </React.Fragment>
    );
  }
}

const afterSubmit = (result: any, dispatch: Dispatch) => {
  window.location.href = "/#section_restaurants";
  dispatch(reset("searchForm"));
};

const loadingSelector = createLoadingSelector(["GET_RESTAURANTS"]);

const wrapped = reduxForm<{}, CustomProps>({
  form: "searchForm",
  onSubmitSuccess: afterSubmit
})(SearchBox);

const mapStateToProps = (state: StateStore): { isFetching: boolean } => {
  return { isFetching: loadingSelector(state) };
};

export default connect(mapStateToProps, { fetchRestaurants })(wrapped);
