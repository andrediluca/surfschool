from django.contrib.auth.models import User
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
        fields = "__all__"
        read_only_fields = ["user", "reference"] 


class SeaConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeaCondition
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
            password=validated_data['password']
        )
        return user
