from django.urls import path
from ecommerce.api.views import (
    AddCouponView,
    AddressListCreateAPIView,
    AddressRetrieveUpdateDestroyAPIView,
    AddToCartView,
    CountryListView,
    ItemDetailView,
    ItemListView,
    OrderSummaryView,
    OrderItemDeleteView,
    OrderQuantityUpdateView,
    PaymentListView,
    PaymentView,
    PaystackChargeView,
    PaystackRecieveView,
)

urlpatterns = [
    path("countries/", CountryListView.as_view(), name="country-list"),
    
    path("addresses/", AddressListCreateAPIView.as_view(), name="address-list-create"),
    path("addresses/<pk>/", AddressRetrieveUpdateDestroyAPIView.as_view(), name="address-retrieve-update-destroy"),
    
    path("products/", ItemListView.as_view(), name="product-list"),
    path("products/<pk>/", ItemDetailView.as_view(), name="product-detail"),
    
    path("orders/add-to-cart/", AddToCartView.as_view(), name="add-to-cart"),
    path("orders/order-summary/", OrderSummaryView.as_view(), name="order-summary"),
    path("orders/checkout/", PaymentView.as_view(), name="checkout"),
    path("orders/add-coupon/", AddCouponView.as_view(), name="add-coupon"),
    path(
        "orders/order-items/<pk>/delete/",
        OrderItemDeleteView.as_view(),
        name="order-item-delete",
    ),
    path(
        "orders/order-item/update-quantity/",
        OrderQuantityUpdateView.as_view(),
        name="order-item-update-quantity",
    ),
    path("payments/", PaymentListView.as_view(), name="payment-list"),
    path("paystack/charge/", PaystackChargeView.as_view(), name="paystack-charge"),
    path("paystack/receive/", PaystackRecieveView.as_view(), name="paystack-receive"),
]
