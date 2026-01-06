export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL

export const API_ENDPOINTS = {
  Base: `${BASE_API_URL}/api/v1`,
  Auth: {
    SignIn: "/auth/sign-in/",
    SignUp: "/auth/sign-up/",
    RefreshToken: "/auth/refresh-token/",
    Me: "/auth/users/me/",
  },
  Addresses: {
    List: "/addresses/",
    ListByAddressType: (addressType: string) => `/addresses?address_type=${addressType}`,
    Create: "/addresses/",
    Detail: (id: string) => `/addresses/${id}/`,
    Update: (id: string) => `/addresses/${id}/`,
    PartialUpdate: (id: string) => `/addresses/${id}/`,
    Delete: (id: string) => `/addresses/${id}/`,
  },
  Countries: {
    List: "/countries/",
  },
  Products: {
    List: "/products/",
    Detail: (id: string) => `/products/${id}/`,
  },
  Orders: {
    AddToCart: "/orders/add-to-cart/",
    AddCoupon: "/orders/add-coupon/",
    Checkout: "/orders/checkout/",
    OrderSummary: "/orders/order-summary/",
    UpdateOrderItemQuantity: "/orders/order-item/update-quantity/",
    DeleteOrderItem: (id: string) => `/orders/order-items/${id}/delete/`,
  },
  Payments: {
    List: "/payments/",
  },
  Paystack: {
    Charge: "/paystack/charge/",
    Receive: "/paystack/receive/",
  },
} as const;
