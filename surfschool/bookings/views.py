from rest_framework import viewsets, generics
from .models import Lesson, Booking
from .models import Lesson, Booking, Surfboard, BoardRental, SeaCondition
from .serializers import (
    LessonSerializer, BookingSerializer,
    SurfboardSerializer, BoardRentalSerializer,
    SeaConditionSerializer, RegisterSerializer
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]   # 🌍 anyone can see lessons



class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
   
    def perform_create(self, serializer):
        lesson = serializer.validated_data['lesson']
        if lesson.spots_left > 0:
            # Automatically assign logged-in user
            booking = serializer.save(user=self.request.user)
            lesson.spots_left -= 1
            lesson.save()
        else:
            raise ValidationError("Sorry, no spots left for this lesson.")

    def perform_destroy(self, instance):
        lesson = instance.lesson
        lesson.spots_left += 1
        lesson.save()
        instance.delete()


class SurfboardViewSet(viewsets.ModelViewSet):
    queryset = Surfboard.objects.all()
    serializer_class = SurfboardSerializer

class BoardRentalViewSet(viewsets.ModelViewSet):
    queryset = BoardRental.objects.all()
    serializer_class = BoardRentalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BoardRental.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        board = serializer.validated_data['board']
        date = serializer.validated_data['date']
        start_time = serializer.validated_data['start_time']
        end_time = serializer.validated_data['end_time']

        if start_time >= end_time:
            raise ValidationError("End time must be after start time.")

        if start_time >= end_time:
            raise ValidationError("End time must be after start time.")

        overlapping = BoardRental.objects.filter(
            board=board,
            date=date,
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        if overlapping.exists():
            raise ValidationError("This surfboard is already booked for that time.")

        serializer.save(user=self.request.user)  # 🔑 force logged-in user

class SeaConditionViewSet(viewsets.ModelViewSet):
    queryset = SeaCondition.objects.all().order_by('-date')
    serializer_class = SeaConditionSerializer
    permission_classes = [AllowAny]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

