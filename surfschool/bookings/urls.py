from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LessonViewSet, BookingViewSet, SurfboardViewSet, BoardRentalViewSet, SeaConditionViewSet, RegisterView

router = DefaultRouter()
router.register(r'lessons', LessonViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'surfboards', SurfboardViewSet)
router.register(r'rentals', BoardRentalViewSet)
router.register(r'conditions', SeaConditionViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
]
