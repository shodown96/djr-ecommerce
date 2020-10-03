import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import BaseRouter from "./routes";
import * as actions from "./store/actions/auth";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./App.css";
import Layout from "./containers/Layout";
import { authAxios } from "./utils";

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  componentDidUpdate() {
    authAxios.defaults.headers.common['Authorization'] = "Token " + this.props.token;
  }

  render() {

    const fadeOut = (el) => {
      el.style.opacity = 1;
      (function fade() {
        if ((el.style.opacity -= .1) < 0) {
          el.style.display = "none";
        } else {
          requestAnimationFrame(fade);
        }
      })();
    };

    const domReady = (callback) => {
      document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
    };

    domReady(() => {
      setTimeout(() => {
        fadeOut(document.querySelector(".splashScreen"))
      }, 1000);
    })



    return (
      <div className="App">
        <div className="splashScreen w-100 h-100 fixed-top">
          <div className="spinner-grow text-white mx-auto" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <Router>
          <Layout {...this.props}>
            <BaseRouter />
          </Layout>
        </Router>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    token: state.auth.token

  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
