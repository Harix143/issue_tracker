from rest_framework import serializers
from .models import Comment
from users.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "issue",
            "content",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "created_by"]
