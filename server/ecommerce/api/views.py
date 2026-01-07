import datetime
import json
from uuid import UUID

import requests
import stripe
from common.exceptions import BadRequestError, NotFoundError
from common.response import EmptyResponse, SuccessResponse, CreatedResponse
from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from django_countries import countries
from ecommerce.api.serializers import (
    AddressSerializer,
    CardSerializer,
    ItemDetailSerializer,
    ItemSerializer,
    OrderSerializer,
    PaymentSerializer,
    PaystackSerializer,
)
from ecommerce.models import Address, Coupon, Item, Order, OrderItem, Payment, Variation
from ecommerce.views import create_ref_code
from events.publisher import publish_event
from rest_framework.generics import (
    DestroyAPIView,
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from utilities.common import is_valid
from vauth.models import Account

stripe.api_key = settings.STRIPE_SECRET_KEY
PAYSTACK_SECRET_KEY = settings.PAYSTACK_SECRET_KEY
EXCHANGE_RATE = settings.EXCHANGE_RATE


class ItemListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemSerializer
    queryset = Item.objects.all()

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=self.get_queryset(), many=True)
        return SuccessResponse(serializer.data).send()


class ItemDetailView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemDetailSerializer
    queryset = Item.objects.all()

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=self.get_object())
        return SuccessResponse(serializer.data).send()


class OrderQuantityUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get("slug", None)
        if slug is None:
            raise BadRequestError("Invalid data.")
        item = Item.objects.filter(slug=slug).first()
        if not item:
            raise NotFoundError()
        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            # check if the order item is in the order
            if order.items.filter(item__slug=item.slug).exists():
                order_item = OrderItem.objects.filter(
                    item=item, user=request.user, ordered=False
                )[0]
                if order_item.quantity > 1:
                    order_item.quantity -= 1
                    order_item.save()
                else:
                    order.items.remove(order_item)
                return EmptyResponse().send()
            else:
                raise BadRequestError("This item was not in your cart.")
        else:
            raise BadRequestError("You do not have an active order.")


class OrderItemDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = OrderItem.objects.all()

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return EmptyResponse().send()


class AddToCartView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get("slug", None)
        if slug is None:
            raise BadRequestError("Invalid request.")
        item = Item.objects.filter(slug=slug).first()
        if not item:
            raise NotFoundError()

        # # mine
        # order_item, created = OrderItem.objects.get_or_create(
        #     item=item,
        #     user=request.user,
        #     ordered=False
        # )
        # order_qs = Order.objects.filter(user=request.user, ordered=False)
        # if order_qs.exists():
        #     order = order_qs[0]
        #     # check if the order item is in the order
        #     if order.items.filter(item__slug=item.slug).exists():
        #         order_item.quantity += 1
        #         order_item.save()
        #         return Response(status=HTTP_200_OK)
        #     else:
        #         order.items.add(order_item)
        #         return Response(status=HTTP_200_OK)
        # else:
        #     ordered_date = timezone.now()
        #     order = Order.objects.create(
        #         user=request.user, ordered_date=ordered_date)
        #     order.items.add(order_item)
        #     return Response(status=HTTP_200_OK)

        variations = request.data.get("variations", [])
        minimum_variation_count = Variation.objects.filter(item=item).count()
        if len(variations) < minimum_variation_count:
            raise BadRequestError("Please specify the required variation types.")

        order_item_qs = OrderItem.objects.filter(
            item=item, user=request.user, ordered=False
        )
        for v in variations:
            order_item_qs = order_item_qs.filter(Q(item_variations__exact=v))

        if order_item_qs.exists():
            order_item = order_item_qs.first()
            order_item.quantity += 1
            order_item.save()
        else:
            order_item = OrderItem.objects.create(
                item=item, user=request.user, ordered=False
            )
            # * allows u to loop through an array
            order_item.item_variations.add(*variations)
            order_item.save()

        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            if not order.items.filter(item__id=order_item.id).exists():
                order.items.add(order_item)
                return EmptyResponse().send()
            else:
                print("#############################")

        else:
            ordered_date = timezone.now()
            order = Order.objects.create(user=request.user, ordered_date=ordered_date)
            order.items.add(order_item)
            return EmptyResponse().send()


class OrderSummaryView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        order = Order.objects.filter(user=self.request.user, ordered=False).first()
        return order

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return EmptyResponse().send()
        serializer = self.serializer_class(instance=self.get_object())
        return SuccessResponse(serializer.data).send()


class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        order_qs = Order.objects.filter(user=self.request.user, ordered=False)
        token = request.data.get("stripeToken")
        print("token", token)
        billing_address_id = request.data.get("selectedBillingAddress")
        shipping_address_id = request.data.get("selectedShippingAddress")

        addresses = list(
            Address.objects.filter(user=request.user).values_list("id", flat=True)
        )
        # change tis to accomadate empty id's
        if (
            not is_valid(billing_address_id)
            or not is_valid(shipping_address_id)
            or billing_address_id not in addresses
            or shipping_address_id not in addresses
        ):
            raise BadRequestError("Please fill in your appropiate addresses.")

        billing_address = Address.objects.get(id=billing_address_id)
        shipping_address = Address.objects.get(id=shipping_address_id)
        if not order_qs.exists():
            raise BadRequestError(
                "Order not found, you've probably checked out already."
            )

        order = order_qs[0]

        # if is_valid(user_profile.stripe_customer_id):
        #     customer = stripe.Customer.retrieve(
        #         user_profile.stripe_customer_id)
        #     # customer.sources.create(source=token)

        # else:
        #     customer = stripe.Customer.create(
        #         email=self.request.user.email,
        #     )
        #     # customer.sources.create(source=token)
        #     user_profile.stripe_customer_id = customer['id']
        #     user_profile.one_click_purchasing = True
        #     user_profile.save()

        amount = int(order.get_total() * 100)

        try:
            # if is_valid(user_profile.stripe_customer_id):
            #     # charge the customer because we cannot charge the token more than once
            #     charge = stripe.Charge.create(
            #         amount=amount,  # cents
            #         currency="usd",
            #         customer=user_profile.stripe_customer_id
            #     )
            # else:
            # charge once off on the token
            print(amount)
            charge = stripe.Charge.create(
                amount=amount, currency="usd", source=token  # cents
            )

            # create the payment
            payment = Payment()
            payment.api_id = charge["id"]
            payment.user = self.request.user
            payment.provider = "stripe"
            payment.amount = order.get_total()
            payment.save()

            # assign the payment to the order

            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            order.billing_address = billing_address
            order.shipping_address = shipping_address
            order.ref_code = create_ref_code()
            order.save()

            raise EmptyResponse("Payment Successful and captured.")

        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get("error", {})
            print(e)
            raise BadRequestError(f"{err.get('message')}")

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            print(e)
            raise BadRequestError("Rate limit error.")

        except stripe.error.InvalidRequestError as e:
            print(e)
            # Invalid parameters were supplied to Stripe's API
            raise BadRequestError("Invalid parameters.")

        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            print(e)
            raise BadRequestError("Not authenticated.")

        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            print(e)
            raise BadRequestError("Network error.")

        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            print(e)
            raise BadRequestError(
                "Something went wrong. You were not charged. Please try again."
            )

        except Exception as e:
            # send an email to ourselves
            print(e)
            raise BadRequestError("A serious error occurred. We have been notifed.")


class AddCouponView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        code = request.data.get("code", None)
        if not is_valid(code):
            raise BadRequestError("Invalid data received.")
        order_qs = Order.objects.filter(user=self.request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
        else:
            raise BadRequestError("Order not found, Probably checkout already.")
        coupon = Coupon.objects.filter(code=code).first()
        if not coupon:
            raise NotFoundError()
        order.coupon = coupon
        order.save()
        return EmptyResponse().send()


class CountryListView(APIView):
    def get(self, request, *args, **kwargs):
        return SuccessResponse(countries).send()


class AddressListCreateAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer
    queryset = Address.objects.all()

    def get_queryset(self, address_type=None):
        if address_type:
            return Address.objects.filter(address_type=address_type)
        return super().get_queryset()

    def list(self, request, *args, **kwargs):
        address_type = request.GET.get("address_type")
        queryset = self.get_queryset(address_type)
        serializer = self.get_serializer(queryset, many=True)
        return SuccessResponse(serializer.data).send()

    def create(self, request, *args, **kwargs):
        data = super().create(request, *args, **kwargs).data
        return CreatedResponse(data).send()


class AddressRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer
    queryset = Address.objects.all()

    def get(self, request, *args, **kwargs):
        data = super().get(request, *args, **kwargs).data
        return SuccessResponse(data).send()

    def update(self, request, *args, **kwargs):
        data = super().update(request, *args, **kwargs).data
        return SuccessResponse(data).send()

    def destroy(self, request, *args, **kwargs):
        data = super().destroy(request, *args, **kwargs).data
        return EmptyResponse(data).send()


class PaymentListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(instance=self.get_queryset(), many=True)
        return SuccessResponse(serializer.data).send()


class PaystackChargeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        order_qs = Order.objects.filter(user=self.request.user, ordered=False)
        billing_address_id = request.data.get("selectedBillingAddress")
        shipping_address_id = request.data.get("selectedShippingAddress")

        addresses = list(
            Address.objects.filter(user=request.user).values_list("id", flat=True)
        )
        # change tis to accomadate empty id's
        if (
            not is_valid(billing_address_id)
            or not is_valid(shipping_address_id)
            or UUID(billing_address_id) not in addresses
            or UUID(shipping_address_id) not in addresses
        ):
            raise BadRequestError("Please fill in your appropiate addresses.")

        billing_address = Address.objects.get(id=billing_address_id)
        shipping_address = Address.objects.get(id=shipping_address_id)
        if not order_qs.exists():
            raise BadRequestError(
                "Order not found, you've probably checked out already."
            )

        order = order_qs[0]
        amount = int(order.get_total() * EXCHANGE_RATE) * 100

        serializer = CardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        info = serializer.data
        payload = {
            "email": info["email"],
            # 'amount': (int(info['amount'] * EXCHANGE_RATE) * 100),  # to dollars
            "amount": amount,
            "card": {
                "cvv": info["cvv"],
                "number": info["number"],
                "expiry_month": info["expiry_month"],
                "expiry_year": info["expiry_year"],
            },
            "pin": info["pin"],
        }
        # print(json.dumps(request.data, sort_keys=True, indent=4))
        # print(json.dumps(info, sort_keys=True, indent=4), serializer.is_valid())
        # print(json.dumps(payload, sort_keys=True, indent=4))
        url = "https://api.paystack.co/charge"
        headers = {
            "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        }
        r = requests.request("POST", url, headers=headers, data=(json.dumps(payload)))
        res = r.json()
        print(json.dumps(res, sort_keys=True, indent=4))
        if res["status"]:
            payment = Payment(
                api_id=str(res["data"]["id"])
                + "-"
                + str(res["data"]["reference"])
                + "-paystack-id-ref",
                user=Account.objects.get(is_superuser=True),
                amount=(order.get_total() * EXCHANGE_RATE),
                provider="paystack",
                paid_at=datetime.datetime.fromisoformat(
                    res["data"]["paid_at"][:-1] + "+00:00"
                ),
            ).save()

            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            order.billing_address = billing_address
            order.shipping_address = shipping_address
            order.ref_code = res["data"]["reference"]
            order.save()

            del res["data"]["id"]
            del res["data"]["authorization"]
            del res["data"]["customer"]
            return SuccessResponse(res, "Payment Successful").send()
        raise BadRequestError("Payment Error", res)


class PaystackRecieveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        order_qs = Order.objects.filter(user=self.request.user, ordered=False)
        billing_address_id = request.data.get("selectedBillingAddress")
        shipping_address_id = request.data.get("selectedShippingAddress")

        addresses = list(
            Address.objects.filter(user=request.user).values_list("id", flat=True)
        )
        print(addresses, addresses[0], billing_address_id in addresses)
        # change tis to accomadate empty id's
        if (
            not is_valid(billing_address_id)
            or not is_valid(shipping_address_id)
            or UUID(billing_address_id) not in addresses
            or UUID(shipping_address_id) not in addresses
        ):
            raise BadRequestError("Please fill in your appropiate addresses.")

        billing_address = Address.objects.get(id=billing_address_id)
        shipping_address = Address.objects.get(id=shipping_address_id)
        if not order_qs.exists():
            raise BadRequestError(
                "Order not found, you've probably checked out already."
            )

        order = order_qs[0]
        amount = int(order.get_total() * EXCHANGE_RATE) * 100
        serializer = PaystackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        info = serializer.data
        if info["status"] == "success" and info["message"] == "Approved":
            payment = Payment(
                user=request.user,
                amount=order.get_total() * EXCHANGE_RATE,
                api_id=str(info["reference"]),
                provider="paystack",
                paid_at=datetime.datetime.now(),
            ).save()
            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            order.billing_address = billing_address
            order.shipping_address = shipping_address
            order.ref_code = info["reference"]
            order.save()
            publish_event(
                "order.completed",
                {
                    "order_id": str(order.id),
                    "user_id": str(order.user_id),
                    "total": order.get_total(),
                },
            )
            return SuccessResponse(None, "Payment Successful").send()
        raise BadRequestError(None, "Payment Error")


# message: "Approved"
# reference: "T552733956388484"
# status: "success"

#  {
#    ...payload
#   "metadata":{
#     "custom_fields":[
#       {
#         "value":"makurdi",
#         "display_name": "Donation for",
#         "variable_name": "donation_for"
#       }
#     ]
#   },
# d = {'a':'Apple', 'b':'Banana','c':'Carrot'}
# a,b,c = [d[k] for k in ('a', 'b','c')]
# url = "https://api.paystack.co/charge/submit_otp"

# payload = 'otp=123456&reference=5bwib5v6anhe9xa'
# headers = {
#     'Authorization': f'Bearer {PAYSTACK_SECRET_KEY}',
# }

# response = requests.request("POST", url, headers=headers, data=payload)
