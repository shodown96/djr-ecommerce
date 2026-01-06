import os, uuid


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


def is_valid(param):
    return param is not None and param != ""


def is_valid_form(values):
    valid = True
    for field in values:
        if field == "":
            valid = False
    return valid


def generate_uuid(length=14):
    return uuid.uuid4().hex[:length]
