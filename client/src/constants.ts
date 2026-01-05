export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL

const apiURL = "/api";

export const endpoint = `${BASE_API_URL}${apiURL}`;

export const loginURL = `${endpoint}/auth/login/`;
export const signupURL = `${endpoint}/auth/signup/`;
export const productListURL = `${endpoint}/products/`;
export const productDetailURL = (id:string) => `${endpoint}/products/${id}/`;
export const addToCartURL = `${endpoint}/add-to-cart/`;
export const orderSummaryURL = `${endpoint}/order-summary/`;
export const checkoutURL = `${endpoint}/checkout/`;
export const addCouponURL = `${endpoint}/add-coupon/`;
export const countryListURL = `${endpoint}/countries/`;
export const userIDURL = `${endpoint}/user-id/`;
export const addressListURL = (addressType:string) =>
  `${endpoint}/addresses/?address_type=${addressType}`;
export const addressCreateURL = `${endpoint}/addresses/create/`;
export const addressUpdateURL = (id:string) => `${endpoint}/addresses/${id}/update/`;
export const addressDeleteURL = (id:string) => `${endpoint}/addresses/${id}/delete/`;
export const orderItemDeleteURL = (id:string) => `${endpoint}/order-items/${id}/delete/`;
export const orderItemUpdateQuantityURL = `${endpoint}/order-item/update-quantity/`;
export const paymentListURL = `${endpoint}/payments/`;
export const userDetailURL = `${endpoint}/user-detail/`;
export const PaystackChargeURL = `${endpoint}/paystack-charge/`;
export const PaystackReceiveURL = `${endpoint}/paystack-receive/`;
