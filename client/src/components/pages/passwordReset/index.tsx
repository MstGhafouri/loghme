import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { CustomBtn } from "../../ui/buttons";
import { Validator } from "../../../validator";
import { forgotPassword, changeUserPassword } from "../../../redux/actions";
import { StateStore } from "../../../redux/reducers";
import { createLoadingSelector } from "../../../redux/reducers/loading";
import CustomInput from "../../ui/customInput";
import CustomBox from "../../ui/customBox";
import AlertBox from "../../ui/alertBox";
import Loader from "../../Loader";

interface MatchParams {
  token: string;
}

export interface PasswordResetProps extends RouteComponentProps<MatchParams> {
  forgotPassword: Function;
  changeUserPassword: Function;
  isFetching: boolean;
}

interface OwnProps {
  email?: string;
  password?: string;
  password_confirm?: string;
}

class PasswordReset extends React.Component<
  PasswordResetProps & InjectedFormProps<{}, PasswordResetProps>
> {
  componentDidMount() {
    document.title = "رمزعبور خود را فراموش کرده‌اید؟";
  }

  renderContent() {
    const {
      match: {
        params: { token }
      }
    } = this.props;
    if (token) {
      return (
        <CustomBox sectionClassNm="login-section" headingText="تغییر رمز‌عبور">
          <form className="register__form" onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <div className="row">
              <div className="col-md-7 mx-auto mb-4">
                <p>رمز‌عبور شما می‌بایست حداقل شامل هفت کاراکتر باشد.</p>
              </div>
              <Field
                name="password"
                component={this.renderInput}
                placeholder="رمز‌عبور"
                type="password"
                validate={[Validator.required, Validator.minLength7]}
              />
              <Field
                name="password_confirm"
                component={this.renderInput}
                placeholder="تکرار رمز‌عبور"
                type="password"
                validate={[Validator.required, Validator.passwordsMatch]}
              />

              <div className="col-md-7 mx-auto mb-4">
                <CustomBtn
                  type="submit"
                  classNm="animated-btn--light animated-btn--space w-100 font-weight-bold"
                  text="ثبت رمز‌عبور"
                />
              </div>
            </div>
          </form>
        </CustomBox>
      );
    }
    return (
      <CustomBox sectionClassNm="login-section" headingText="فراموشی رمز‌عبور">
        <form className="register__form" onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <div className="row">
            <div className="col-md-7 mx-auto mb-4">
              <p>
                آدرس ایمیل حساب‌کاربری خود را وارد کنید، سپس لینک بازنشانی رمز عبور از طریق ایمیل
                برای شما ارسال خواهد شد.
              </p>
            </div>
            <Field
              name="email"
              component={this.renderInput}
              placeholder="ایمیل"
              type="email"
              validate={[Validator.required, Validator.email]}
            />

            <div className="col-md-7 mx-auto mb-4">
              <CustomBtn
                type="submit"
                classNm="animated-btn--light animated-btn--space w-100 font-weight-bold"
                text="ارسال ایمیل"
              />
            </div>
          </div>
        </form>
      </CustomBox>
    );
  }

  renderError({ error, touched }: { error: string; touched: boolean }) {
    if (error && touched) {
      return <AlertBox message={error} />;
    }
  }

  renderInput = ({ meta, wrapperClass = "col-md-7 mx-auto mb-4", ...others }: any) => {
    return (
      <div className={`${wrapperClass} ${meta.error && meta.touched ? "error" : ""}`}>
        <CustomInput {...others} />
        {this.renderError(meta)}
      </div>
    );
  };

  onSubmit = (formValues: OwnProps): void => {
    const {
      forgotPassword,
      changeUserPassword,
      match: {
        params: { token }
      }
    } = this.props;
    if ("email" in formValues) forgotPassword(formValues.email);
    else
      changeUserPassword(
        { password: formValues.password, passwordConfirm: formValues.password_confirm },
        token
      );
  };

  render() {
    return (
      <React.Fragment>
        {this.renderContent()}
        <Loader loading={this.props.isFetching} position="fixed" />
      </React.Fragment>
    );
  }
}

const wrapped = reduxForm<{}, PasswordResetProps>({
  form: "passwordResetForm"
})(PasswordReset);

const loadingSelector = createLoadingSelector(["RESET_PASSWORD", "FORGOT_PASSWORD"]);

const mapStateToProps = (state: StateStore): { isFetching: boolean } => {
  return { isFetching: loadingSelector(state) };
};

export default connect(mapStateToProps, { forgotPassword, changeUserPassword })(
  withRouter(wrapped)
);
