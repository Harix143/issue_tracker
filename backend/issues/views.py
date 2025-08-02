from rest_framework import viewsets, permissions
from .models import Issue
from .serializers import IssueSerializer
from projects.models import Project
from common.permissions import ensure_project_member


class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # only issues in projects you belong to
        qs = Issue.objects.filter(project__members=self.request.user)
        project_id = self.request.query_params.get("project")
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs

    def perform_create(self, serializer):
        project_id = self.request.data.get("project")
        project = Project.objects.get(pk=project_id)
        ensure_project_member(self.request.user, project)
        serializer.save(created_by=self.request.user)
