import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def migrate_lessons_to_slots(apps, schema_editor):
    """For every existing Lesson, create one LessonSlot carrying its old fields.
    Then point every Booking at the new slot."""
    Lesson = apps.get_model('bookings', 'Lesson')
    LessonSlot = apps.get_model('bookings', 'LessonSlot')
    Booking = apps.get_model('bookings', 'Booking')

    lesson_to_slot = {}
    for lesson in Lesson.objects.all():
        slot = LessonSlot.objects.create(
            lesson=lesson,
            level=lesson.level_required,
            instructor=lesson.instructor,
            max_participants=lesson.max_participants,
            spots_left=lesson.spots_left,
        )
        lesson_to_slot[lesson.id] = slot

    for booking in Booking.objects.all():
        booking.slot = lesson_to_slot[booking.lesson_id]
        booking.save()


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # 1. Create LessonSlot table
        migrations.CreateModel(
            name='LessonSlot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level', models.CharField(choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('advanced', 'Advanced')], max_length=20)),
                ('instructor', models.CharField(max_length=100)),
                ('max_participants', models.IntegerField(default=10)),
                ('spots_left', models.IntegerField(default=10)),
                ('lesson', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='slots', to='bookings.lesson')),
            ],
        ),

        # 2. Add Booking.slot as nullable (data migration fills it)
        migrations.AddField(
            model_name='booking',
            name='slot',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='bookings.lessonslot'),
        ),

        # 3. Data migration
        migrations.RunPython(migrate_lessons_to_slots, migrations.RunPython.noop),

        # 4. Make Booking.slot non-nullable
        migrations.AlterField(
            model_name='booking',
            name='slot',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bookings.lessonslot'),
        ),

        # 5. Remove old Booking.lesson FK
        migrations.RemoveField(model_name='booking', name='lesson'),

        # 6. Strip legacy fields from Lesson
        migrations.RemoveField(model_name='lesson', name='level_required'),
        migrations.RemoveField(model_name='lesson', name='instructor'),
        migrations.RemoveField(model_name='lesson', name='max_participants'),
        migrations.RemoveField(model_name='lesson', name='spots_left'),
    ]
