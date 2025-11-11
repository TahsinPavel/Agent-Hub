from django.db import models
from django.contrib.auth.models import User

class Agent(models.Model):
    workspace = models.ForeignKey('Workspace', on_delete=models.CASCADE, related_name='agents')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name



class Workspace(models.Model):
    name = models.CharField(max_length=100, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_workspaces")
    members = models.ManyToManyField(User, related_name="workspaces", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name