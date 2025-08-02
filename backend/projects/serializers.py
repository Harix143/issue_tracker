from rest_framework import serializers
from .models import Project
from users.serializers import UserSerializer


class ProjectSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    members_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        required=False,
        default=[],
        queryset=UserSerializer.Meta.model.objects.all(),
        source="members",
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "members",
            "members_ids",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]
