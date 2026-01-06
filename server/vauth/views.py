from vauth.serializers import Account, AccountDetailSerializer
from common.exceptions import NotFoundError
from common.response import SuccessResponse
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView

# Create your views here.


class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        return SuccessResponse({"userID": request.user.id}).send()


class UserDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = AccountDetailSerializer

    def get_object(self):
        try:
            user = Account.objects.get(id=self.request.user.id)
            return user
        except ObjectDoesNotExist:
            # raise Http404("user not found")
            raise NotFoundError("user not found")
