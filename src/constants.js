const debug = false
let host = debug ? "http://127.0.0.1:8000" : "https://djr-ecommerce.herokuapp.com";

export default host;

const apiURL = "/api";

export const endpoint = `${host}${apiURL}`;

export const productListURL = `${endpoint}/products/`;
export const productDetailURL = id => `${endpoint}/products/${id}/`;
export const addToCartURL = `${endpoint}/add-to-cart/`;
export const orderSummaryURL = `${endpoint}/order-summary/`;
export const checkoutURL = `${endpoint}/checkout/`;
export const addCouponURL = `${endpoint}/add-coupon/`;
export const countryListURL = `${endpoint}/countries/`;
export const userIDURL = `${endpoint}/user-id/`;
export const addressListURL = addressType =>
  `${endpoint}/addresses/?address_type=${addressType}`;
export const addressCreateURL = `${endpoint}/addresses/create/`;
export const addressUpdateURL = id => `${endpoint}/addresses/${id}/update/`;
export const addressDeleteURL = id => `${endpoint}/addresses/${id}/delete/`;
export const orderItemDeleteURL = id => `${endpoint}/order-items/${id}/delete/`;
export const orderItemUpdateQuantityURL = `${endpoint}/order-item/update-quantity/`;
export const paymentListURL = `${endpoint}/payments/`;
export const userDetailURL = `${endpoint}/user-detail/`;
export const PaystackChargeURL = `${endpoint}/paystack-charge/`;
export const PaystackReceiveURL = `${endpoint}/paystack-receive/`;

export const stripeKey = "pk_test_51HPyn0FyNz3IOs9CbTEzGzGabecd5LM6vokVSiWmyVpHJbX3hM5hDX8zDrzmQ9517Wwrz1u7QJz31FydlrmRXbEl00vsz7YsdJ"
export const paystackKey = "pk_test_3a3b0b7dff98f6fe26d1f2f06616457342cc0b7e"

export const redirect = (props, location = "/login") => {
  if (!props.token) { return props.history.push(location) }
}