import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { raiseUserCredit, User } from "../../../redux/actions";
import { Field, reduxForm, InjectedFormProps, reset } from "redux-form";
import { Validator } from "../../../validator";
import { CustomBtn } from "../../ui/buttons";
import { StateStore } from "../../../redux/reducers/index";
import CustomInput from "../../ui/customInput";
import AlertBox from "../../ui/alertBox";
import Loader from "../../Loader";
import { createLoadingSelector } from "../../../redux/reducers/loading";

export interface CreditTabProps {
  raiseUserCredit: Function;
  currentUser: User | null;
  isFetching: boolean;
}

export interface CustomProps {}

class CreditTab extends React.Component<CreditTabProps & InjectedFormProps<{}, CreditTabProps>> {
  renderErr = (error: string, touched: boolean) => {
    if (error && touched) return <AlertBox message={error} />;
  };

  renderInput = ({ meta: { error, touched }, ...other }: any) => {
    return (
      <div className={error && touched ? "error" : ""}>
        <CustomInput {...other} />
        {this.renderErr(error, touched)}
      </div>
    );
  };

  onSubmit = (formValues: any) => {
    const { raiseUserCredit, currentUser } = this.props;
    const newCredit = +formValues.credit + currentUser!?.credit;
    raiseUserCredit(newCredit);
  };

  render() {
    return (
      <React.Fragment>
        <div id="credit-body">
          <form className="profile__credit-form" onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <Field
              name="credit"
              component={this.renderInput}
              inputClassNm="form-control"
              placeholder="حداقل میزان افزایش اعتبار ۵۰۰ ت"
              type="number"
              validate={[Validator.required, Validator.minValue500]}
            />
            <CustomBtn type="submit" classNm="animated-btn--light" text=" افزایش" />
          </form>
        </div>
        <Loader loading={this.props.isFetching} position="fixed" />
      </React.Fragment>
    );
  }
}

const afterSubmit = (result: any, dispatch: Dispatch) => dispatch(reset("chargeCreditForm"));

const loadingSelector = createLoadingSelector(["CHARGE_CREDIT"]);

const wrapped = reduxForm<{}, CreditTabProps>({
  form: "chargeCreditForm",
  onSubmitSuccess: afterSubmit
})(CreditTab);

const mapStateToProps = (state: StateStore): { currentUser: User | null; isFetching: boolean } => {
  const {
    user: { currentUser }
  } = state;

  return { currentUser, isFetching: loadingSelector(state) };
};
export default connect(mapStateToProps, { raiseUserCredit })(wrapped);
