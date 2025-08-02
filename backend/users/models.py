from django.db import models

# Create your models here.
# backend/users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Inherit from AbstractUser so we can add custom fields later if needed.
    For now this behaves exactly like the built-in User model.
    """

    # e.g. add extra fields here:
    # bio = models.TextField(blank=True)
    pass
