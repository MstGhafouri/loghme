import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "../Footer";
import Navigation from "../Navigation";

const Layout: React.SFC = props => {
  // console.log(props);
  return (
    <div className="body">
      <Navigation />
      <main className="main">{props.children}</main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Layout;
