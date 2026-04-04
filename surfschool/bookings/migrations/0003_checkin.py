from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0002_lesson_slots'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='checked_in',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='boardrental',
            name='checked_in',
            field=models.BooleanField(default=False),
        ),
    ]
