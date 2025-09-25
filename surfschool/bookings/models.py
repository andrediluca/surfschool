from django.db import models
from django.contrib.auth.models import User
import uuid

class Lesson(models.Model):
    LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    date = models.DateField()
    time = models.TimeField()
    level_required = models.CharField(max_length=20, choices=LEVELS)
    max_participants = models.IntegerField()
    spots_left = models.IntegerField()
    instructor = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.date} {self.time} - {self.level_required}"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('booked', 'Booked'),
        ('waitlist', 'Waitlist'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="booked")

    def __str__(self):
        return f"{self.user.username} → {self.lesson} ({self.status})"
    
class Surfboard(models.Model):
    TYPES = [
        ('shortboard', 'Shortboard'),
        ('longboard', 'Longboard'),
        ('soft-top', 'Soft-top'),
    ]

    type = models.CharField(max_length=20, choices=TYPES)
    size = models.CharField(max_length=20)  # e.g. "7'6", "8'0"
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.size} {self.type} ({'Available' if self.is_available else 'Rented'})"


class BoardRental(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    board = models.ForeignKey(Surfboard, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    reference = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)  # ✅ unique booking ref

    def __str__(self):
        return f"{self.user} - {self.board} on {self.date} ({self.reference})"

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
    wave_height = models.CharField(max_length=50, blank=True, null=True)  # e.g. "1-2m"
    water_temp = models.CharField(max_length=50, blank=True, null=True)  # e.g. "22°C"

    def __str__(self):
        return f"{self.date} – {self.level_suitability}"


