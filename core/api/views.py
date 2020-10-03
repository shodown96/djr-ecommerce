import json
import requests
import datetime
from django_countries import countries
from django.db.models import Q
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework.generics import (
    ListAPIView, RetrieveAPIView, CreateAPIView,
    UpdateAPIView, DestroyAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
)
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from core.models import Item, OrderItem, Order
from .serializers import (
    ItemSerializer, OrderSerializer, ItemDetailSerializer, AddressSerializer,
    PaymentSerializer, UserDetailSerializer, User, CardSerializer, PaystackSerializer
)
from core.models import Item, OrderItem, Order, Address, Payment, Coupon, Refund, UserProfile, Variation, ItemVariation
from core.views import create_ref_code
# from rest_auth.registration.views import RegisterView, TokenSerializer, JWTSerializer
# from rest_auth.views import LoginView
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY
PAYSTACK_SECRET_KEY = settings.PAYSTACK_SECRET_KEY
EXCHANGE_RATE = settings.EXCHANGE_RATE


class IsOwnerOrAdmin(BasePermission):

    def has_permission(self, request, view):
        # can write custom code
        # get user from user table.
        # qs = User.objects.filter(pk=view.kwargs['pk'])
        # if qs.exists():
        #     user = qs[0]
        if request.user == view.get_object():
            return True
        if request.user.is_superuser:
            return True
        return False


def is_valid(param):
    return param is not None and param != ""


class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({'userID': request.user.id}, status=HTTP_200_OK)


class UserDetailView(RetrieveUpdateDestroyAPIView):
    # permission_classes = (IsOwnerOrAdmin,)
    serializer_class = UserDetailSerializer
    # queryset = User.objects.all()

    def get_object(self):
        try:
            user = User.objects.get(id=self.request.user.id)
            return user
        except ObjectDoesNotExist:
            raise Http404("User not found")
        return None


class ItemListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemSerializer
    queryset = Item.objects.all()


class ItemDetailView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemDetailSerializer
    queryset = Item.objects.all()


class OrderQuantityUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Item, slug=slug)
        order_qs = Order.objects.filter(
            user=request.user,
            ordered=False
        )
        if order_qs.exists():
            order = order_qs[0]
            # check if the order item is in the order
            if order.items.filter(item__slug=item.slug).exists():
                order_item = OrderItem.objects.filter(
                    item=item,
                    user=request.user,
                    ordered=False
                )[0]
                if order_item.quantity > 1:
                    order_item.quantity -= 1
                    order_item.save()
                else:
                    order.items.remove(order_item)
                return Response(status=HTTP_200_OK)
            else:
                return Response({"message": "This item was not in your cart."}, status=HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "You do not have an active order."}, status=HTTP_400_BAD_REQUEST)


class OrderItemDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = OrderItem.objects.all()


class AddToCartView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message": "Invalid request."}, status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Item, slug=slug)

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

        variations = request.data.get('variations', [])
        minimum_variation_count = Variation.objects.filter(item=item).count()
        if len(variations) < minimum_variation_count:
            return Response({"message": "Please specify the required variation types."}, status=HTTP_400_BAD_REQUEST)

        order_item_qs = OrderItem.objects.filter(
            item=item,
            user=request.user,
            ordered=False
        )
        for v in variations:
            order_item_qs = order_item_qs.filter(
                Q(item_variations__exact=v)
            )

        if order_item_qs.exists():
            order_item = order_item_qs.first()
            order_item.quantity += 1
            order_item.save()
        else:
            order_item = OrderItem.objects.create(
                item=item,
                user=request.user,
                ordered=False
            )
            # * allows u to loop through an array
            order_item.item_variations.add(*variations)
            order_item.save()

        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            if not order.items.filter(item__id=order_item.id).exists():
                order.items.add(order_item)
                return Response(status=HTTP_200_OK)
            else:
                print("#############################")

        else:
            ordered_date = timezone.now()
            order = Order.objects.create(
                user=request.user, ordered_date=ordered_date)
            order.items.add(order_item)
            return Response(status=HTTP_200_OK)


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            return order
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")
            # return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class PaymentView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        order_qs = Order.objects.filter(user=self.request.user, ordered=False)
        userprofile = UserProfile.objects.get(user=self.request.user)
        token = request.data.get('stripeToken')
        print("token", token)
        billing_address_id = request.data.get('selectedBillingAddress')
        shipping_address_id = request.data.get('selectedShippingAddress')

        addresses = list(Address.objects.filter(
            user=request.user).values_list('id', flat=True))
        # change tis to accomadate empty id's
        if not is_valid(billing_address_id) or not is_valid(shipping_address_id) or int(billing_address_id) not in addresses or int(shipping_address_id) not in addresses:
            return Response({"message": "Please fill in your appropiate addresses."}, status=HTTP_400_BAD_REQUEST)

        billing_address = Address.objects.get(id=billing_address_id)
        shipping_address = Address.objects.get(id=shipping_address_id)
        if not order_qs.exists():
            return Response({"message": "Order not found, you've probably checked out already."}, status=HTTP_400_BAD_REQUEST)

        order = order_qs[0]

        # if is_valid(userprofile.stripe_customer_id):
        #     customer = stripe.Customer.retrieve(
        #         userprofile.stripe_customer_id)
        #     # customer.sources.create(source=token)

        # else:
        #     customer = stripe.Customer.create(
        #         email=self.request.user.email,
        #     )
        #     # customer.sources.create(source=token)
        #     userprofile.stripe_customer_id = customer['id']
        #     userprofile.one_click_purchasing = True
        #     userprofile.save()

        amount = int(order.get_total() * 100)

        try:
            # if is_valid(userprofile.stripe_customer_id):
            #     # charge the customer because we cannot charge the token more than once
            #     charge = stripe.Charge.create(
            #         amount=amount,  # cents
            #         currency="usd",
            #         customer=userprofile.stripe_customer_id
            #     )
            # else:
            # charge once off on the token
            print(amount)
            charge = stripe.Charge.create(
                amount=amount,  # cents
                currency="usd",
                source=token
            )

            # create the payment
            payment = Payment()
            payment.stripe_charge_id = charge['id']
            payment.user = self.request.user
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

            return Response(status=HTTP_200_OK, data={"message": "Payment Successful and captured."})

        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get('error', {})
            print(e)
            return Response({"message": f"{err.get('message')}"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            print(e)
            messages.warning(self.request, "Rate limit error")
            return Response({"message": "Rate limit error."}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.InvalidRequestError as e:
            print(e)
            # Invalid parameters were supplied to Stripe's API
            return Response({"message": "Invalid parameters."}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            print(e)
            return Response({"message": "Not authenticated."}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            print(e)
            return Response({"message": "Network error."}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            print(e)
            return Response({"message": "Something went wrong. You were not charged. Please try again."}, status=HTTP_400_BAD_REQUEST)

        except Exception as e:
            # send an email to ourselves
            print(e)
            return Response({"message": "A serious error occurred. We have been notifed."}, status=HTTP_400_BAD_REQUEST)

        return Response({"message": "Invalid data received."}, status=HTTP_400_BAD_REQUEST)


class AddCouponView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        code = request.data.get('code', None)
        if not is_valid(code):
            return Response({"message": "Invalid data received."}, status=HTTP_400_BAD_REQUEST)
        order_qs = Order.objects.filter(
            user=self.request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
        else:
            return Response({"message": "Order not found, Probably checkout already."}, status=HTTP_400_BAD_REQUEST)
        coupon = get_object_or_404(Coupon, code=code)
        order.coupon = coupon
        order.save()
        return Response(status=HTTP_200_OK)


class CountryListView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(countries, status=HTTP_200_OK)


class AddressListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer

    def get_queryset(self):
        address_type = self.request.query_params.get('address_type', None)
        qs = Address.objects.all()
        if address_type is None:
            return qs
        return qs.filter(user=self.request.user, address_type=address_type)


class AddressCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class AddressUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class AddressDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = Address.objects.all()


class PaymentListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class PaystackChargeView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        order_qs = Order.objects.filter(user=self.request.user, ordered=False)
        userprofile = UserProfile.objects.get(user=self.request.user)
        billing_address_id = request.data.get('selectedBillingAddress')
        shipping_address_id = request.data.get('selectedShippingAddress')

        addresses = list(Address.objects.filter(
            user=request.user).values_list('id', flat=True))
        # change tis to accomadate empty id's
        if not is_valid(billing_address_id) or not is_valid(shipping_address_id) or int(billing_address_id) not in addresses or int(shipping_address_id) not in addresses:
            return Response({"message": "Please fill in your appropiate addresses."}, status=HTTP_400_BAD_REQUEST)

        billing_address = Address.objects.get(id=billing_address_id)
        shipping_address = Address.objects.get(id=shipping_address_id)
        if not order_qs.exists():
            return Response({"message": "Order not found, you've probably checked out already."}, status=HTTP_400_BAD_REQUEST)

        order = order_qs[0]
        amount = int(order.get_total() * EXCHANGE_RATE) * 100

        serializer = CardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        info = serializer.data
        payload = {
            'email': info['email'],
            # 'amount': (int(info['amount'] * EXCHANGE_RATE) * 100),  # to dollars
            'amount': amount,
            'card': {
                'cvv': info['cvv'],
                'number': info['number'],
                'expiry_month': info['expiry_month'],
                'expiry_year': info['expiry_year']
            },
            'pin': info['pin']
        }
        # print(json.dumps(request.data, sort_keys=True, indent=4))
        # print(json.dumps(info, sort_keys=True, indent=4), serializer.is_valid())
        # print(json.dumps(payload, sort_keys=True, indent=4))
        url = "https://api.paystack.co/charge"
        headers = {
            'Authorization': f'Bearer {PAYSTACK_SECRET_KEY}',
        }
        r = requests.request("POST", url, headers=headers,
                             data=(json.dumps(payload)))
        res = r.json()
        print(json.dumps(res, sort_keys=True, indent=4))
        if res['status']:
            payment = Payment(stripe_charge_id=str(res['data']['id']) + "-" + str(res['data']['reference']) + "-paystack-id-ref",
                              user=User.objects.get(is_superuser=True),
                              amount=(order.get_total() * EXCHANGE_RATE),
                              timestamp=datetime.datetime.fromisoformat(res['data']['paid_at'][:-1] + "+00:00")).save()

            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            order.billing_address = billing_address
            order.shipping_address = shipping_address
            order.ref_code = res['data']['reference']
            order.save()

            del res['data']['id']
            del res['data']['authorization']
            del res['data']['customer']
            return Response({'message': "Payment Successful.", "response": res}, status=HTTP_200_OK)
        return Response({'message': "Payment Error.", "response": res}, status=HTTP_400_BAD_REQUEST)


class PaystackRecieveView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        order_qs = Order.objects.filter(user=self.request.user, ordered=False)
        userprofile = UserProfile.objects.get(user=self.request.user)
        billing_address_id = request.data.get('selectedBillingAddress')
        shipping_address_id = request.data.get('selectedShippingAddress')

        addresses = list(Address.objects.filter(
            user=request.user).values_list('id', flat=True))
        # change tis to accomadate empty id's
        if not is_valid(billing_address_id) or not is_valid(shipping_address_id) or int(billing_address_id) not in addresses or int(shipping_address_id) not in addresses:
            return Response({"message": "Please fill in your appropiate addresses."}, status=HTTP_400_BAD_REQUEST)

        billing_address = Address.objects.get(id=billing_address_id)
        shipping_address = Address.objects.get(id=shipping_address_id)
        if not order_qs.exists():
            return Response({"message": "Order not found, you've probably checked out already."}, status=HTTP_400_BAD_REQUEST)

        order = order_qs[0]
        amount = int(order.get_total() * EXCHANGE_RATE) * 100
        serializer = PaystackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        info = serializer.data
        if info['status'] == "success" and info['message'] == "Approved":
            payment = Payment(
                user=request.user,
                amount=order.get_total() * EXCHANGE_RATE,
                stripe_charge_id=str(info['reference']) + "-paystack",
                timestamp=datetime.datetime.now()
            ).save()
            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            order.billing_address = billing_address
            order.shipping_address = shipping_address
            order.ref_code = info['reference']
            order.save()
            return Response({'message': "Payment Successful."}, status=HTTP_200_OK)
        return Response({'message': "Payment Error."}, status=HTTP_400_BAD_REQUEST)

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
