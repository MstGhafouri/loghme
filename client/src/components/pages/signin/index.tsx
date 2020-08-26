import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { Link } from "react-router-dom";
import { CustomBtn } from "../../ui/buttons";
import { Validator } from "../../../validator";
import { signInUser, googleSignIn } from "../../../redux/actions";
import { StateStore } from "../../../redux/reducers";
import { createLoadingSelector } from "../../../redux/reducers/loading";
import { GoogleLogin } from "react-google-login";
import CustomInput from "../../ui/customInput";
import CustomBox from "../../ui/customBox";
import AlertBox from "../../ui/alertBox";
import Loader from "../../Loader";
import icon from "../../../resources/img/icons-google.png";

export interface SignInProps {
  signInUser: Function;
  googleSignIn: Function;
  isFetching: boolean;
}

interface OwnProps {
  email?: string;
  password?: string;
}

declare global {
  interface Window {
    gapi: any;
  }
}

class SignIn extends React.Component<SignInProps & InjectedFormProps<{}, SignInProps>> {
  auth: any;
  componentDidMount() {
    document.title = "ورود";
  }

  componentWillUnmount() {
    if (window.gapi.auth2) window.gapi.auth2.getAuthInstance().signOut();
  }
  responseGoogle = (response: any) => {
    const {
      profileObj: { email, givenName, familyName }
    } = response;
    // console.log(response);
    this.props.googleSignIn({ email, givenName, familyName });
  };

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
    this.props.signInUser(formValues);
  };

  renderIcon = () => {
    return (
      <div>
        <span>ورود با حساب‌کاربری گوگل</span>
        <img src={icon} alt="google" height="25" className="mx-3" />
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <CustomBox sectionClassNm="login-section" headingText="ورود">
          <form className="register__form" onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <div className="row">
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
              <div className="col-md-7 mx-auto mb-4">
                <Link to="#" className="font-weight-light u-font-size-sm">
                  رمز‌عبور خود را فراموش کرده‌ام
                </Link>
              </div>
              <div className="col-md-7 mx-auto mb-4">
                <CustomBtn
                  type="submit"
                  classNm="animated-btn--light animated-btn--space w-100 font-weight-bold"
                  text="ورود"
                />
              </div>
              <div className="col-md-7 mx-auto mb-5">
                <hr />
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
                  render={renderProps => (
                    <CustomBtn
                      type="button"
                      classNm="u-box-shadow-sm border text-secondary w-100 loginButton"
                      text={this.renderIcon()}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    />
                  )}
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                  isSignedIn={false}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
              <div className="col-md-7 mx-auto">
                <p>
                  کاربر جدید هستید؟
                  <Link to="/signup">ثبت‌نام در لقمه</Link>
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

const wrapped = reduxForm<{}, SignInProps>({
  form: "loginForm"
})(SignIn);

const loadingSelector = createLoadingSelector(["SIGN_IN_USER", "GOOGLE_SIGN_IN"]);

const mapStateToProps = (state: StateStore): { isFetching: boolean } => {
  return { isFetching: loadingSelector(state) };
};

export default connect(mapStateToProps, { signInUser, googleSignIn })(wrapped);
