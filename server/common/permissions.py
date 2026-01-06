from rest_framework.permissions import BasePermission


class IsOwnerOrAdmin(BasePermission):

    def has_permission(self, request, view):
        # can write custom code
        # get user from user table.
        # qs = Account.objects.filter(pk=view.kwargs['pk'])
        # if qs.exists():
        #     user = qs[0]
        if request.user == view.get_object():
            return True
        if request.user.is_superuser:
            return True
        return False
