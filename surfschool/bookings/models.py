from django.db import models
from django.contrib.auth.models import User
import uuid

class Lesson(models.Model):
    """A surf session — a time block. Levels and instructors live in LessonSlot."""
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return f"{self.date} {self.time}"


class LessonSlot(models.Model):
    """One level/instructor group within a Lesson session."""
    LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='slots')
    level = models.CharField(max_length=20, choices=LEVELS)
    instructor = models.CharField(max_length=100)
    max_participants = models.IntegerField(default=10)
    spots_left = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.lesson} — {self.level} ({self.instructor})"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('booked', 'Booked'),
        ('waitlist', 'Waitlist'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    slot = models.ForeignKey(LessonSlot, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    reference = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    checked_in = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} → {self.slot} ({self.status})"


class Surfboard(models.Model):
    TYPES = [
        ('shortboard', 'Shortboard'),
        ('longboard', 'Longboard'),
        ('soft-top', 'Soft-top'),
    ]

    type = models.CharField(max_length=20, choices=TYPES)
    size = models.CharField(max_length=20)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.size} {self.type} ({'Available' if self.is_available else 'Unavailable'})"


class BoardRental(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    board = models.ForeignKey(Surfboard, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    reference = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    checked_in = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} - {self.board} on {self.date} ({self.reference})"


class SurfCall(models.Model):
    """A competition-style surf call: a waiting window that can be flipped ON."""
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('on', 'On'),
        ('off', 'Off'),
    ]

    title = models.CharField(max_length=100, default='Delta9 Surf School')
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='waiting')
    note = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.title} {self.start_date}–{self.end_date} [{self.status}]"


class PushSubscription(models.Model):
    """Browser push subscription endpoint stored per user."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='push_subscriptions')
    endpoint = models.TextField(unique=True)
    p256dh = models.TextField()
    auth = models.TextField()
    notify_lessons = models.BooleanField(default=True)
    notify_surf_call = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} push sub"


class SeaCondition(models.Model):
    LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('all', 'All Levels'),
    ]

    date = models.DateField(unique=True)
    description = models.TextField()
    level_suitability = models.CharField(max_length=20, choices=LEVELS)
    wave_height = models.CharField(max_length=50, blank=True, null=True)
    water_temp = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.date} – {self.level_suitability}"
