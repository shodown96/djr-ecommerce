# apps/core/models/activity.py

from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
import uuid


class Activity(models.Model):
    class Kind(models.TextChoices):
        NOTIFICATION = "notification"
        EVENT = "event"
        AUDIT = "audit"
        WEBHOOK = "webhook"

    class Status(models.TextChoices):
        PENDING = "pending"
        PROCESSED = "processed"
        FAILED = "failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    kind = models.CharField(
        max_length=32,
        choices=Kind.choices,
        db_index=True,
    )

    type = models.CharField(
        max_length=128,
        db_index=True,
        help_text="Domain type e.g. order.completed, user.registered"
    )

    actor_id = models.UUIDField(
        null=True,
        blank=True,
        db_index=True,
        help_text="Who triggered this"
    )

    # Generic relation (any model)
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    object_id = models.CharField(max_length=255, null=True, blank=True)
    subject = GenericForeignKey("content_type", "object_id")

    payload = models.JSONField(
        default=dict,
        help_text="Arbitrary structured data"
    )

    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    idempotency_key = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        unique=True,
        help_text="Used to prevent duplicate processing"
    )

    occurred_at = models.DateTimeField(default=timezone.now)
    processed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["kind", "type"]),
            models.Index(fields=["status"]),
            models.Index(fields=["occurred_at"]),
        ]

    def mark_processed(self):
        self.status = self.Status.PROCESSED
        self.processed_at = timezone.now()
        self.save(update_fields=["status", "processed_at"])

    def mark_failed(self):
        self.status = self.Status.FAILED
        self.save(update_fields=["status"])

    def __str__(self):
        return f"{self.kind}:{self.type}:{self.id}"
