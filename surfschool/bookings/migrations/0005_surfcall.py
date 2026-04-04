from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0004_booking_reference'),
    ]

    operations = [
        migrations.CreateModel(
            name='SurfCall',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='Delta9 Surf School', max_length=100)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('status', models.CharField(choices=[('waiting', 'Waiting'), ('on', 'On'), ('off', 'Off')], default='waiting', max_length=10)),
                ('note', models.CharField(blank=True, max_length=200)),
            ],
            options={
                'ordering': ['-start_date'],
            },
        ),
    ]
