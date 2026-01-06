from rest_framework.views import exception_handler
from common.constants import EXCEPTION_TYPES, EnvironmentModes
from utilities.common import get_environment_mode


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        default_exception = (
            EXCEPTION_TYPES.get(exc.status_code)
            if getattr(exc, "status_code")
            else None
        )
        if default_exception:
            exc.default_code = default_exception.get("name")
            # if the error is internal, don't expose it to the user
            # in production, still required in development
            if (
                get_environment_mode() == EnvironmentModes.Production
                and exc.status_code == 500
            ):
                # TODO log the message
                exc.detail = default_exception.get("message")
            message = getattr(exc, "message", default_exception.get("message"))
            response.data = {
                "code": exc.default_code,
                "message": message,
                "error": exc.detail,
            }
    return response
