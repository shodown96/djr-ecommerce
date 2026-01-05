import { BrowserRouter, Route, Routes } from "react-router-dom";

import ErrorPage from "./containers/ErrorPage";
import Home from "./containers/Home";
import Login from "./containers/Login";
import OrderSummary from "./containers/OrderSummary";
import ProductDetail from "./containers/ProductDetail";
import ProductList from "./containers/ProductList";
import Profile from "./containers/Profile";
import Signup from "./containers/Signup";
import Checkout from "./containers/WrappedForm";
import Layout from "./containers/Layout";

const BaseRouter = () => {
  return (

    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:productID" element={<ProductDetail />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-summary" element={<OrderSummary />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/profile" element={<Profile />} />

          {/* Catch-all */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default BaseRouter;
