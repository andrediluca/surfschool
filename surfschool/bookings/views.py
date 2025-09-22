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
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import time


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
    @action(detail=False, methods=["get"], permission_classes=[AllowAny])  # availability can be public
    def availability(self, request):
        board_id = request.query_params.get("board")
        date = request.query_params.get("date")

        if not board_id or not date:
            return Response({"error": "board and date are required"}, status=400)

        rentals = BoardRental.objects.filter(board_id=board_id, date=date)

        slots = []
        for hour in range(8, 20):  # only go up to 19 → 20:00
            slot_start = time(hour, 0)
            slot_end = time(hour + 1, 0)

            booked = rentals.filter(
                start_time__lt=slot_end, end_time__gt=slot_start
            ).exists()

            slots.append({
                "hour": f"{hour:02d}:00",
                "booked": booked
            })

        return Response(slots)
class SeaConditionViewSet(viewsets.ModelViewSet):
    queryset = SeaCondition.objects.all().order_by("-date")
    serializer_class = SeaConditionSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

