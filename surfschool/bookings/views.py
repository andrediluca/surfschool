from rest_framework import viewsets
from .models import Lesson, Booking
from .models import Lesson, Booking, Surfboard, BoardRental, SeaCondition
from .serializers import (
    LessonSerializer, BookingSerializer,
    SurfboardSerializer, BoardRentalSerializer,
    SeaConditionSerializer
)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import Lesson, Booking
from .serializers import LessonSerializer, BookingSerializer

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        lesson = serializer.validated_data['lesson']
        if lesson.spots_left > 0:
            booking = serializer.save()
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

    def perform_create(self, serializer):
        board = serializer.validated_data['board']
        date = serializer.validated_data['date']
        start_time = serializer.validated_data['start_time']
        end_time = serializer.validated_data['end_time']

        # Find overlapping rentals
        overlapping = BoardRental.objects.filter(
            board=board,
            date=date,
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        if overlapping.exists():
            raise ValidationError("This surfboard is already booked for that time.")

        serializer.save()

    

class SeaConditionViewSet(viewsets.ModelViewSet):
    queryset = SeaCondition.objects.all().order_by('-date')
    serializer_class = SeaConditionSerializer
