import React from "react";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { Link } from "react-router-dom";
import CustomBox from "../../ui/customBox";
import { CustomBtn } from "../../ui/buttons";
import { Validator } from "../../../validator";
import CustomInput from "../../ui/customInput";
import AlertBox from "../../ui/alertBox";
import { createLoadingSelector } from "../../../redux/reducers/loading";
import { connect } from "react-redux";
import { StateStore } from "../../../redux/reducers";
import { signUpUser } from "../../../redux/actions";
import Loader from "../../Loader";

export interface SignupProps {
  signUpUser: Function;
  isFetching: boolean;
}

interface OwnProps {
  name?: string;
  family?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  password_confirm?: string;
}

class Signup extends React.Component<SignupProps & InjectedFormProps<{}, SignupProps>> {
  componentDidMount() {
    document.title = "ثبت نام";
  }

  renderError({ error, touched }: { error: string; touched: boolean }) {
    if (error && touched) {
      return <AlertBox message={error} />;
    }
  }

  renderInput = ({ meta, wrapperClass = "col-md-6 mb-5", ...others }: any) => {
    return (
      <div className={`${wrapperClass} ${meta.error && meta.touched ? "error" : ""}`}>
        <CustomInput {...others} />
        {this.renderError(meta)}
      </div>
    );
  };

  onSubmit = (formValues: OwnProps): void => {
    const { password, email, name, phoneNumber, family, password_confirm } = formValues;
    this.props.signUpUser({
      firstName: name!,
      lastName: family!,
      email: email!,
      phoneNumber: phoneNumber!,
      password: password!,
      passwordConfirm: password_confirm!
    });
  };

  render() {
    return (
      <React.Fragment>
        <CustomBox sectionClassNm="register-section" headingText="ثبت‌نام در لقمه">
          <form className="register__form" onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <div className="row">
              <Field
                name="name"
                component={this.renderInput}
                placeholder="نام"
                type="text"
                validate={Validator.required}
              />
              <Field
                name="family"
                component={this.renderInput}
                placeholder="نام خانوادگی"
                type="text"
                validate={Validator.required}
              />
              <Field
                name="phoneNumber"
                component={this.renderInput}
                placeholder="شماره تماس ۱۲۳۴۵۶۷-۰۹۱۲"
                type="text"
                validate={[Validator.required, Validator.phoneNumber]}
              />
              <Field
                name="email"
                component={this.renderInput}
                placeholder="ایمیل"
                type="email"
                validate={[Validator.required, Validator.email]}
              />
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

              <div className="col-md-6 mb-md-0 mb-4">
                <CustomBtn type="submit" classNm="animated-btn--light w-50" text=" ثبت اطلاعات" />
              </div>
              <div className="col-md-6">
                <p>
                  قبلا در لقمه ثبت‌نام کرده‌اید؟
                  <Link to="/signin">وارد شوید</Link>
                </p>
              </div>
            </div>
          </form>
        </CustomBox>
        <Loader loading={this.props.isFetching} position="fixed" />
      </React.Fragment>
    );
  }
}

const wrapped = reduxForm<{}, SignupProps>({
  form: "registerForm"
})(Signup);

const loadingSelector = createLoadingSelector(["SIGN_UP_USER"]);

const mapStateToProps = (state: StateStore): { isFetching: boolean } => {
  return { isFetching: loadingSelector(state) };
};

export default connect(mapStateToProps, { signUpUser })(wrapped);

// const validate = (formValues: any) => {
//   const error: any = {};

//   if (!formValues.name) error.name = "فیلد نام الزامی است";
//   if (!formValues.family) error.family = "فیلد نام‌خانوادگی الزامی است";

//   if (!Validator.phoneNumber(formValues.phoneNumber)) error.phoneNumber = "شماره تماس معتبر نیست";

//   if (!Validator.email(formValues.email)) error.email = "آدرس ایمیل معتبر نیست";

//   if (!formValues.password) error.password = "فیلد رمز‌عبور الزامی است";
//   else if (formValues.password.length < 7) error.password = "حداقل طول رمز عبور ۷ کاراکتر می‌باشد";
//   if (!formValues.password_confirm) error.password_confirm = "فیلد تکرار رمز‌عبور الزامی است";
//   else if (formValues.password !== formValues.password_confirm)
//     error.password_confirm = "رمزعبور تطابق ندارد";

//   return error;
// };
