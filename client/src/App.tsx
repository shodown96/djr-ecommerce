import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./global.css";
import { authCheckState } from "./store/actions/auth";

import ErrorPage from "./containers/ErrorPage";
import Home from "./containers/Home";
import Layout from "./containers/Layout";
import SignIn from "./containers/SignIn";
import SignUp from "./containers/SignUp";
import Profile from "./containers/Profile";
import OrderSummary from "./containers/OrderSummary";
import ProductDetail from "./containers/ProductDetail";
import ProductList from "./containers/ProductList";
import Checkout from "./containers/WrappedForm";


const App = ({ onTryAutoSignup }: any) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    onTryAutoSignup();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [onTryAutoSignup]);

  return (
    <div className="App">
      {showSplash ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      ) : null}

      <BrowserRouter>
          <Routes>
            <Route element={<Layout/>}>
              <Route path="/" element={<Home />} />

            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:productID" element={<ProductDetail />} />

            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-summary" element={<OrderSummary />} />

            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route path="/profile" element={<Profile />} />

            {/* Catch-all */}
            <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
      </BrowserRouter>
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  onTryAutoSignup: () => dispatch(authCheckState()),
});

export default connect(null, mapDispatchToProps)(App);
