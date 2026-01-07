import jwt
from typing import Dict
from django.conf import settings
from django.utils import timezone
from cryptography.fernet import Fernet

# from common.models import APIToken
# from common.exceptions import BadRequestError

# TODO: Switch to custom authentication instead of using rest_framework


def generate_account_token(account_id, token: str, refresh=False):
    """
    generate_jwt_token generate a jwt token for the authenticated user
    Arguments:
        account(Account): the account the jwt belongs to
        token(str): the session token to bind to the JWT token
        refresh(bool): this determines if its an authentication token or refresh token default false

    returns:
        str: the jwt token for the authenticated account
    """
    iat = timezone.now()
    # token expires after a month
    exp = iat + timezone.timedelta(days=30)

    f = Fernet(settings.ID_ENCRYPT_KEY)
    token_params = {
        "iat": int(iat.strftime("%s")),
        # "iss": settings.APP_URL,
        "account_id": f.encrypt(str(account_id).encode()).decode(),
        "app_token": f.encrypt(str(token.key).encode()).decode(),
        "is_staff": False,
        "is_superuser": False,
        "exp": int(exp.strftime("%s")),
    }
    return create_api_token(token_params, refresh)

def create_api_token(token_params: Dict[str, str], is_refresh: bool = False):
    """
    create_api_token creates a JWT api token that represents the authenticvation
    of an account once this is called a new JWT token is created for access to
    protected endpoints in the system.
    """
    secret = settings.JWT_AUTH["JWT_SECRET_KEY"]
    algorithm = settings.JWT_AUTH["JWT_ALGORITHM"]
    resp_token = None
    if is_refresh:
        token_params["type"] = "refresh_token"
    else:
        token_params["type"] = "auth_token"
    resp_token = jwt.encode(token_params, secret, algorithm=algorithm)
    return str(resp_token)


# def destroy_api_token(account):
#     """
#     destroy_api_token destroys the api token bound to the JWT that represents the
#     authentication of the account and logs out the request, once this is called on a JWT
#     the token is invalidated.
#     """
#     app_tokens = APIToken.objects.filter(account=account, expired=False)
#     if not app_tokens:
#         raise BadRequestError()
#     # expire all the tokens
#     for token in app_tokens:
#         token.expired = True
#         token.expired_at = timezone.now()
#         token.save()
