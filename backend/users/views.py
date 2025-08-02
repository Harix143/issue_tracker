from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserSerializer


class RegisterAPI(generics.CreateAPIView):
    """
    POST username, email, password → create a new user account.
    """

    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class UserAPI(generics.RetrieveAPIView):
    """
    GET → return the current authenticated user’s data.
    """

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
