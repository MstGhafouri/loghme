import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { StateStore } from "../redux/reducers";
import { User, TempUser } from "../redux/actions";

import history from "../history";
import Layout from "./Hoc/Layout";
import Home from "./pages/home";
import Signup from "./pages/signup";
import SignIn from "./pages/signin";
import PasswordReset from './pages/passwordReset';
import UserProfile from "./pages/userProfile";
import Restaurant from "./pages/restaurant";
import NotFound from "./pages/404";

import "../resources/vendors/bootstrap/css/bootstrap-rtl.min.css";
import "../resources/vendors/fonts/vazir-fonts/fonts.css";
import "../resources/vendors/icons/flaticon.css";
import "../resources/sass/main.scss";

export interface AppProps {
  currentUser: User | null;
  temporaryUser: TempUser | undefined;
}

function App({ currentUser, temporaryUser }: AppProps): JSX.Element {
  let email: string;
  let name: string;
  let family: string;
  if (temporaryUser) {
    email = temporaryUser.email;
    name = temporaryUser.givenName;
    family = temporaryUser.familyName;
  }

  return (
    <Router history={history}>
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/restaurant/:slug" exact component={Restaurant} />
          <Route
            path="/profile"
            exact
            render={() => (currentUser ? <UserProfile /> : <Redirect to="/signin" />)}
          />
          <Route
            path="/signup"
            exact
            render={() =>
              currentUser ? <Redirect to="/" /> : <Signup initialValues={{ email, name, family }} />
            }
          />
          <Route
            path="/signin"
            exact
            render={() => (currentUser ? <Redirect to="/" /> : <SignIn />)}
          />
          <Route
            path="/password-reset"
            exact
            render={() => (currentUser ? <Redirect to="/" /> : <PasswordReset />)}
          />
          <Route
            path="/password-reset/:token"
            exact
            render={() => (currentUser ? <Redirect to="/" /> : <PasswordReset />)}
          />
          <Route path="/404" exact component={NotFound} />
          <Redirect to="/404" />
        </Switch>
      </Layout>
    </Router>
  );
}

const mapStateToProps = ({
  user: { currentUser, temporaryUser }
}: StateStore): { currentUser: User | null; temporaryUser: TempUser | undefined } => {
  return {
    currentUser,
    temporaryUser
  };
};

export default connect(mapStateToProps)(App);
