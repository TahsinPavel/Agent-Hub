from django.db import models
from django.conf import settings

class Workspace(models.Model):
    name = models.CharField(max_length=100, unique=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="owned_workspaces")
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="workspaces", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Agent(models.Model):
    workspace = models.ForeignKey('Workspace', on_delete=models.CASCADE, related_name='agents', null=True, blank=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
