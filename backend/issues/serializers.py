from rest_framework import serializers
from .models import Issue
from users.serializers import UserSerializer
from comments.serializers import CommentSerializer


class IssueSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Issue
        fields = [
            "id",
            "title",
            "description",
            "project",
            "created_by",
            "status",
            "comments",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "created_by"]
