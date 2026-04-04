import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0003_checkin'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='reference',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
