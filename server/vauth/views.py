from common.exceptions import AuthenticationError, NotFoundError, BadRequestError
from common.permissions import IsOwnerOrAdmin
from common.response import CreatedResponse
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from vauth.serializers import Account, AccountCreateSerializer, AccountDetailSerializer

# Create your views here.
class UserDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOrAdmin]
    serializer_class = AccountDetailSerializer

    def get_object(self):
        try:
            user = Account.objects.get(id=self.request.user.id)
            return user
        except ObjectDoesNotExist:
            # raise Http404("user not found")
            raise NotFoundError("user not found")


class UserCreateView(APIView):
    serializer = AccountCreateSerializer

    def get_tokens_for_user(self, user):
        if not user.is_active:
            raise AuthenticationError("User is not active")

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

    def post(self, request, *args, **kwargs):
        # Account.objects.all().delete()
        serializer = self.serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            tokens = self.get_tokens_for_user(user)
            serializer = self.serializer(user)
            return CreatedResponse({"user": serializer.data, "tokens": tokens}).send()
