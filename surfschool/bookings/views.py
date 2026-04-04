import datetime
from rest_framework import viewsets, generics, mixins
from .models import Lesson, LessonSlot, Booking, Surfboard, BoardRental, SeaCondition, SurfCall
from .serializers import (
    LessonSerializer, LessonSlotSerializer, BookingSerializer,
    SurfboardSerializer, BoardRentalSerializer,
    SeaConditionSerializer, SurfCallSerializer, RegisterSerializer,
    InstructorLessonSerializer, InstructorSlotSerializer,
    InstructorBookingSerializer, InstructorRentalSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission, SAFE_METHODS
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.db.models import Q, Prefetch
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from datetime import time


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


def _promote_waitlist(slot):
    """Promote the earliest waitlisted booking for a slot, or return the spot."""
    waitlisted = Booking.objects.filter(slot=slot, status='waitlist').order_by('id').first()
    if waitlisted:
        waitlisted.status = 'booked'
        waitlisted.save()
    else:
        slot.spots_left += 1
        slot.save()


# ── Public / user-facing views ────────────────────────────────────────────────

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'is_staff': request.user.is_staff,
        })


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only: lessons with their slots."""
    queryset = Lesson.objects.prefetch_related('slots').order_by('date', 'time')
    serializer_class = LessonSerializer
    permission_classes = [AllowAny]


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).select_related(
            'slot', 'slot__lesson'
        )

    def perform_create(self, serializer):
        slot = serializer.validated_data['slot']
        lesson = slot.lesson

        # One active booking per lesson session per user
        if Booking.objects.filter(
            user=self.request.user,
            slot__lesson=lesson,
        ).exclude(status='cancelled').exists():
            raise ValidationError("Hai già una prenotazione per questa sessione.")

        if slot.spots_left > 0:
            serializer.save(user=self.request.user)
            slot.spots_left -= 1
            slot.save()
        else:
            raise ValidationError("Nessun posto disponibile in questo gruppo.")

    def perform_destroy(self, instance):
        slot = instance.slot
        instance.delete()
        _promote_waitlist(slot)


class SurfboardViewSet(viewsets.ModelViewSet):
    queryset = Surfboard.objects.all()
    serializer_class = SurfboardSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsStaff()]


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

        if not board.is_available:
            raise ValidationError("This surfboard is not available for rental.")
        if start_time >= end_time:
            raise ValidationError("End time must be after start time.")

        overlapping = BoardRental.objects.filter(
            board=board, date=date,
            start_time__lt=end_time, end_time__gt=start_time,
        )
        if overlapping.exists():
            raise ValidationError("This surfboard is already booked for that time.")

        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def availability(self, request):
        board_id = request.query_params.get("board")
        date = request.query_params.get("date")
        if not board_id or not date:
            return Response({"error": "board and date are required"}, status=400)

        rentals = BoardRental.objects.filter(board_id=board_id, date=date)
        slots = []
        for hour in range(8, 20):
            slot_start = time(hour, 0)
            slot_end = time(hour + 1, 0)
            booked = rentals.filter(start_time__lt=slot_end, end_time__gt=slot_start).exists()
            slots.append({"hour": f"{hour:02d}:00", "booked": booked})
        return Response(slots)


class SeaConditionViewSet(viewsets.ModelViewSet):
    queryset = SeaCondition.objects.all().order_by("-date")
    serializer_class = SeaConditionSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]


class SurfCallView(APIView):
    """Public: returns the single active call (waiting or on), if any."""
    permission_classes = [AllowAny]

    def get(self, request):
        call = SurfCall.objects.exclude(status='off').first()
        if not call:
            return Response(None)
        return Response(SurfCallSerializer(call).data)


class InstructorSurfCallViewSet(viewsets.ModelViewSet):
    queryset = SurfCall.objects.all()
    serializer_class = SurfCallSerializer
    permission_classes = [IsStaff]


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# ── Instructor / Admin views ──────────────────────────────────────────────────

class InstructorLessonViewSet(viewsets.ModelViewSet):
    """Full lesson/session management for staff."""
    queryset = Lesson.objects.prefetch_related('slots').order_by('date', 'time')
    serializer_class = InstructorLessonSerializer
    permission_classes = [IsStaff]


class InstructorSlotViewSet(viewsets.ModelViewSet):
    """Create / update / delete slots within a lesson session."""
    queryset = LessonSlot.objects.select_related('lesson').all()
    serializer_class = InstructorSlotSerializer
    permission_classes = [IsStaff]

    def perform_create(self, serializer):
        max_p = serializer.validated_data.get('max_participants', 10)
        instructor = serializer.validated_data.get('instructor') or (
            self.request.user.get_full_name() or self.request.user.username
        )
        serializer.save(spots_left=max_p, instructor=instructor)


class InstructorConditionViewSet(viewsets.ModelViewSet):
    queryset = SeaCondition.objects.all().order_by("-date")
    serializer_class = SeaConditionSerializer
    permission_classes = [IsStaff]


class InstructorBookingViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    Staff can list/retrieve all bookings and update status or move between slots.
    Moving a booking (changing slot) adjusts spots_left on both old and new slots.
    """
    queryset = Booking.objects.select_related("user", "slot", "slot__lesson").all()
    serializer_class = InstructorBookingSerializer
    permission_classes = [IsStaff]

    def get_queryset(self):
        qs = super().get_queryset()
        lesson_id = self.request.query_params.get("lesson")
        slot_id = self.request.query_params.get("slot")
        date = self.request.query_params.get("date")
        if lesson_id:
            qs = qs.filter(slot__lesson_id=lesson_id)
        if slot_id:
            qs = qs.filter(slot_id=slot_id)
        if date:
            qs = qs.filter(slot__lesson__date=date)
        return qs

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        old_slot = serializer.instance.slot
        instance = serializer.save()

        # Handle slot move (drag between levels)
        if instance.slot_id != old_slot.id and instance.status != 'cancelled':
            old_slot.spots_left += 1
            old_slot.save()
            instance.slot.spots_left -= 1
            instance.slot.save()

        # Handle cancellation → promote waitlist on the slot the booking was on
        if old_status != 'cancelled' and instance.status == 'cancelled':
            _promote_waitlist(old_slot)


class InstructorRentalViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = BoardRental.objects.select_related("user", "board").all().order_by("-date")
    serializer_class = InstructorRentalSerializer
    permission_classes = [IsStaff]

    def get_queryset(self):
        qs = super().get_queryset()
        date = self.request.query_params.get("date")
        board_id = self.request.query_params.get("board")
        ref = self.request.query_params.get("ref")
        if date:
            qs = qs.filter(date=date)
        if board_id:
            qs = qs.filter(board_id=board_id)
        if ref:
            qs = qs.filter(reference=ref)
        return qs


class CheckinView(APIView):
    """
    Scan a QR (rental reference UUID) or look up a booking by id.
    GET  ?ref=<uuid>  → returns rental details
    POST { ref }      → marks rental as checked_in, returns details
    POST { booking_id } → marks lesson booking as checked_in
    """
    permission_classes = [IsStaff]

    def _resolve(self, ref):
        """Try rental first, then lesson booking by reference UUID."""
        try:
            rental = BoardRental.objects.select_related("user", "board").get(reference=ref)
            return "rental", rental
        except (BoardRental.DoesNotExist, Exception):
            pass
        try:
            booking = Booking.objects.select_related("user", "slot", "slot__lesson").get(reference=ref)
            return "booking", booking
        except (Booking.DoesNotExist, Exception):
            pass
        return None, None

    def get(self, request):
        ref = request.query_params.get("ref")
        if not ref:
            return Response({"error": "ref required"}, status=400)
        kind, obj = self._resolve(ref)
        if not obj:
            return Response({"error": "Prenotazione non trovata."}, status=404)
        if kind == "rental":
            return Response({"type": "rental", "data": InstructorRentalSerializer(obj).data})
        return Response({"type": "booking", "data": InstructorBookingSerializer(obj).data})

    def post(self, request):
        ref = request.data.get("ref")
        booking_id = request.data.get("booking_id")

        if ref:
            kind, obj = self._resolve(ref)
            if not obj:
                return Response({"error": "Prenotazione non trovata."}, status=404)
            obj.checked_in = True
            obj.save()
            if kind == "rental":
                return Response({"type": "rental", "data": InstructorRentalSerializer(obj).data})
            return Response({"type": "booking", "data": InstructorBookingSerializer(obj).data})

        if booking_id:
            try:
                booking = Booking.objects.select_related("user", "slot", "slot__lesson").get(id=booking_id)
            except Booking.DoesNotExist:
                return Response({"error": "Prenotazione non trovata."}, status=404)
            booking.checked_in = True
            booking.save()
            return Response({"type": "booking", "data": InstructorBookingSerializer(booking).data})

        return Response({"error": "ref o booking_id richiesto"}, status=400)


class MyStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        bookings = list(
            Booking.objects.filter(user=user)
            .select_related('slot', 'slot__lesson')
            .order_by('-slot__lesson__date')
        )
        rentals = list(
            BoardRental.objects.filter(user=user).select_related('board').order_by('-date')
        )

        active = [b for b in bookings if b.status != 'cancelled']
        levels = {}
        for b in active:
            lvl = b.slot.level
            levels[lvl] = levels.get(lvl, 0) + 1

        board_types = {}
        for r in rentals:
            t = r.board.type
            board_types[t] = board_types.get(t, 0) + 1

        level_order = ['beginner', 'intermediate', 'advanced']
        current_level = None
        for lvl in reversed(level_order):
            if levels.get(lvl, 0) > 0:
                current_level = lvl
                break

        upcoming = [b for b in active if b.slot.lesson.date >= datetime.date.today()]

        return Response({
            'username': user.username,
            'total_lessons': len(active),
            'cancelled': len(bookings) - len(active),
            'levels': levels,
            'current_level': current_level,
            'total_rentals': len(rentals),
            'board_types': board_types,
            'upcoming_lessons': len(upcoming),
            'last_lesson_date': active[0].slot.lesson.date.isoformat() if active else None,
            'last_rental_date': rentals[0].date.isoformat() if rentals else None,
        })


class InstructorStudentView(APIView):
    permission_classes = [IsStaff]

    def get(self, request):
        users = User.objects.filter(
            Q(booking__isnull=False) | Q(boardrental__isnull=False)
        ).distinct().prefetch_related(
            Prefetch(
                'booking_set',
                queryset=Booking.objects.select_related('slot', 'slot__lesson').order_by('-slot__lesson__date'),
            ),
            Prefetch(
                'boardrental_set',
                queryset=BoardRental.objects.select_related('board').order_by('-date'),
            ),
        )

        result = []
        for user in users:
            bookings = list(user.booking_set.all())
            rentals = list(user.boardrental_set.all())

            active = [b for b in bookings if b.status != 'cancelled']
            levels = {}
            for b in active:
                lvl = b.slot.level
                levels[lvl] = levels.get(lvl, 0) + 1

            board_types = {}
            for r in rentals:
                t = r.board.type
                board_types[t] = board_types.get(t, 0) + 1

            level_order = ['beginner', 'intermediate', 'advanced']
            current_level = None
            for lvl in reversed(level_order):
                if levels.get(lvl, 0) > 0:
                    current_level = lvl
                    break

            last_lesson_date = active[0].slot.lesson.date.isoformat() if active else None
            last_rental_date = rentals[0].date.isoformat() if rentals else None

            result.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'total_lessons': len(active),
                'cancelled': len(bookings) - len(active),
                'levels': levels,
                'current_level': current_level,
                'total_rentals': len(rentals),
                'board_types': board_types,
                'last_lesson_date': last_lesson_date,
                'last_rental_date': last_rental_date,
            })

        result.sort(key=lambda x: x['total_lessons'], reverse=True)
        return Response(result)
