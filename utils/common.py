import os

def get_environment_mode():
    environment = "dev"
    if "prod" in os.environ.get("ENV", "dev"):
        environment = "prod"
    if "staging" in os.environ.get("ENV", "dev"):
        environment = "staging"
    return environment


def get_client_ip(request):
    if not request:
        return ""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR", "")
    return ip