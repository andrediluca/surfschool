from rest_framework import serializers
from .models import Lesson, Booking, Surfboard, BoardRental, SeaCondition

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class SurfboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Surfboard
        fields = '__all__'

class BoardRentalSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardRental
        fields = '__all__'

class SeaConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeaCondition
        fields = '__all__'
