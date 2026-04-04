from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LessonViewSet, BookingViewSet, SurfboardViewSet,
    BoardRentalViewSet, SeaConditionViewSet, RegisterView, MeView,
    InstructorLessonViewSet, InstructorSlotViewSet, InstructorConditionViewSet,
    InstructorBookingViewSet, InstructorRentalViewSet, InstructorSurfCallViewSet,
    InstructorStudentView, MyStatsView, CheckinView, SurfCallView, InstructorListView,
)

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'surfboards', SurfboardViewSet)
router.register(r'rentals', BoardRentalViewSet)
router.register(r'conditions', SeaConditionViewSet)

instructor_router = DefaultRouter()
instructor_router.register(r'lessons', InstructorLessonViewSet)
instructor_router.register(r'slots', InstructorSlotViewSet)
instructor_router.register(r'conditions', InstructorConditionViewSet)
instructor_router.register(r'bookings', InstructorBookingViewSet)
instructor_router.register(r'rentals', InstructorRentalViewSet)
instructor_router.register(r'surfcall', InstructorSurfCallViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/stats/', MyStatsView.as_view(), name='my-stats'),
    path('surfcall/', SurfCallView.as_view(), name='surfcall'),
    path('instructor/', include(instructor_router.urls)),
    path('instructor/students/', InstructorStudentView.as_view(), name='instructor-students'),
    path('instructor/instructors/', InstructorListView.as_view(), name='instructor-list'),
    path('instructor/checkin/', CheckinView.as_view(), name='instructor-checkin'),
]
