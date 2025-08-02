from rest_framework.exceptions import PermissionDenied


def ensure_project_member(user, project):
    if user not in project.members.all():
        raise PermissionDenied("Must be a project member to perform this action.")
