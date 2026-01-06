import uuid

from django.db import models


class BaseImmutableModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class BaseModel(BaseImmutableModel):
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True
