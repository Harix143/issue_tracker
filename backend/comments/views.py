from rest_framework import viewsets, permissions
from .models import Comment
from .serializers import CommentSerializer
from issues.models import Issue
from common.permissions import ensure_project_member


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(issue__project__members=self.request.user)

    def perform_create(self, serializer):
        issue_id = self.request.data.get("issue")
        issue = Issue.objects.get(pk=issue_id)
        ensure_project_member(self.request.user, issue.project)
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        # only comments on projects you belong to
        qs = Comment.objects.filter(issue__project__members=self.request.user)
        issue_id = self.request.query_params.get("issue")
        if issue_id:
            qs = qs.filter(issue_id=issue_id)
        return qs
