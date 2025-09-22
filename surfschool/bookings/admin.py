from django.contrib import admin
from .models import Lesson, Booking, Surfboard, BoardRental, SeaCondition

admin.site.register(Lesson)
admin.site.register(Booking)
admin.site.register(Surfboard)
admin.site.register(BoardRental)
admin.site.register(SeaCondition)
