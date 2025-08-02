# tracker/urls.py

from pathlib import Path

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import RegisterAPI, UserAPI
from projects.views import ProjectViewSet
from issues.views import IssueViewSet
from comments.views import CommentViewSet

# 1) Register DRF ViewSets
router = routers.DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"issues", IssueViewSet, basename="issue")
router.register(r"comments", CommentViewSet, basename="comment")

# 2) Core URL patterns
urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth
    path("api/auth/signup/", RegisterAPI.as_view(), name="signup"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", UserAPI.as_view(), name="user-detail"),
    # API routes
    path("api/", include(router.urls)),
]

# 3) Catch-all: serve React's index.html for any non-API route
#    (ensure your TEMPLATES setting points at frontend/build/)
urlpatterns += [
    re_path(
        r"^(?!api/).*$",
        TemplateView.as_view(template_name="index.html"),
        name="spa",
    ),
]
