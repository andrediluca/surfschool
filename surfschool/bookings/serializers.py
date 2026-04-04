from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Lesson, LessonSlot, Booking, Surfboard, BoardRental, SeaCondition, SurfCall


class LessonSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonSlot
        fields = '__all__'
        read_only_fields = ['spots_left']


class LessonSerializer(serializers.ModelSerializer):
    slots = LessonSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'date', 'time', 'slots']


class BookingSerializer(serializers.ModelSerializer):
    slot_detail = LessonSlotSerializer(source='slot', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user', 'reference']


class SurfboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Surfboard
        fields = '__all__'


class BoardRentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardRental
        fields = '__all__'
        read_only_fields = ['user', 'reference']


class SeaConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeaCondition
        fields = '__all__'


# ── Instructor serializers ────────────────────────────────────────────────────

class InstructorSlotSerializer(serializers.ModelSerializer):
    """Full slot management for staff. spots_left is set from max_participants on create."""
    class Meta:
        model = LessonSlot
        fields = '__all__'
        read_only_fields = ['spots_left']


class InstructorLessonSerializer(serializers.ModelSerializer):
    slots = InstructorSlotSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'date', 'time', 'slots']


class InstructorBookingSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    lesson_date = serializers.DateField(source='slot.lesson.date', read_only=True)
    lesson_time = serializers.TimeField(source='slot.lesson.time', read_only=True)
    slot_level = serializers.CharField(source='slot.level', read_only=True)
    slot_instructor = serializers.CharField(source='slot.instructor', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'username', 'slot', 'lesson_date', 'lesson_time', 'slot_level', 'slot_instructor', 'status', 'checked_in', 'reference']


class InstructorRentalSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    board_type = serializers.CharField(source='board.type', read_only=True)
    board_size = serializers.CharField(source='board.size', read_only=True)

    class Meta:
        model = BoardRental
        fields = ['id', 'username', 'board', 'board_type', 'board_size', 'date', 'start_time', 'end_time', 'reference', 'checked_in']


class SurfCallSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurfCall
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
        )
        return user
