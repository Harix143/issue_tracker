# tracker/urls.py

from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from users.views import RegisterAPI, UserAPI
from projects.views import ProjectViewSet
from issues.views import IssueViewSet
from comments.views import CommentViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Import for serving React’s index.html
from django.views.generic import TemplateView

router = routers.DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"issues", IssueViewSet, basename="issue")
router.register(r"comments", CommentViewSet, basename="comment")

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth
    path("api/auth/signup/", RegisterAPI.as_view(), name="signup"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", UserAPI.as_view(), name="user-detail"),
    # Domain APIs
    path("api/", include(router.urls)),
]

# Anything else (that isn’t /api/...) should serve index.html
urlpatterns += [
    re_path(
        r"^(?!api/).*$", TemplateView.as_view(template_name="index.html"), name="spa"
    ),
]

import pathlib
from django.views.generic import TemplateView

# ... your existing urlpatterns ...

# Catch-all: serve the React build’s index.html for any non-API path
urlpatterns += [
    re_path(
        r"^(?!api/).*$",  # anything that does NOT start with "api/"
        TemplateView.as_view(
            # absolute path to your build/index.html
            template_name=str(
                pathlib.Path(__file__).resolve().parent.parent
                / "frontend"
                / "build"
                / "index.html"
            )
        ),
        name="spa",
    ),
]
