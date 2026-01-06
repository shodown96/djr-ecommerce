from rest_framework.response import Response
from rest_framework import status
from common.constants import Strings


class BaseResponse:
    def send(self):
        return Response(
            data=self.response_object,
            status=self.response_object["code"],
            headers=self.headers,
        )


class SuccessResponse(BaseResponse):
    def __init__(self, data=None, message=Strings.Success, headers=None):
        self.headers = headers
        self.response_object = {
            "code": status.HTTP_200_OK,
            "message": message,
            "data": data,
        }


class CreatedResponse(BaseResponse):
    def __init__(self, data=None, message=Strings.Success, headers=None):
        self.headers = headers
        self.response_object = {
            "code": status.HTTP_201_CREATED,
            "message": message,
            "data": data,
        }


class EmptyResponse(BaseResponse):
    def __init__(self, message=Strings.Success, headers=None):
        self.headers = headers
        self.response_object = {
            "code": status.HTTP_204_NO_CONTENT,
            "message": message,
            "data": None,
        }
