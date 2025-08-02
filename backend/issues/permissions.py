# issues/permissions.py

from rest_framework import permissions
from projects.models import Project


class IsProjectMember(permissions.BasePermission):
    """
    Allow create/update/delete of Issues only if request.user is in
    issue.project.members.
    """

    def has_permission(self, request, view):
        # Anyone can list or retrieve
        if view.action in ("list", "retrieve"):
            return True

        # For create, check that the user is a member of the given project
        if view.action == "create":
            project_id = request.data.get("project")
            if not project_id:
                return False
            try:
                project = Project.objects.get(pk=project_id)
            except Project.DoesNotExist:
                return False
            return request.user in project.members.all()

        # For other actions (update, partial_update, destroy), defer to has_object_permission
        return True

    def has_object_permission(self, request, view, obj):
        # Safe methods are allowed
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only allow edits/deletes if user is member of obj.project
        return request.user in obj.project.members.all()
