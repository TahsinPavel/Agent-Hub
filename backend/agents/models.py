from django.db import models

class Agent(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, default='idle')  # idle, busy, offline, etc.
    last_task = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# Note: removed a duplicate Agent class definition. The model above contains
# name, description, status, last_task, and timestamps. If you intentionally
# only wanted name/description, reduce fields and create a new migration.