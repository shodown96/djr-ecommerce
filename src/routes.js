import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Home from "./containers/Home";
import ProductList from "./containers/ProductList";
import OrderSummary from "./containers/OrderSummary";
import Checkout from "./containers/WrappedForm";
import ProductDetail from "./containers/ProductDetail";
import Profile from "./containers/Profile";
import ErrorPage from "./containers/ErrorPage";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/products" component={ProductList} />
    <Route path="/products/:productID" component={ProductDetail} />
    <Route exact path="/checkout" component={Checkout} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/profile" component={Profile} />
    <Route exact path="/" component={Home} />
    <Route path="" component={ErrorPage} />
  </Hoc>
);

export default BaseRouter;
