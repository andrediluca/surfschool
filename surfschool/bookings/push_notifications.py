import json
import logging
import threading

from django.conf import settings
from pywebpush import webpush, WebPushException

logger = logging.getLogger(__name__)


def _send(subscription, title, body, url='/'):
    try:
        webpush(
            subscription_info={
                "endpoint": subscription.endpoint,
                "keys": {
                    "p256dh": subscription.p256dh,
                    "auth": subscription.auth,
                },
            },
            data=json.dumps({"title": title, "body": body, "url": url}),
            vapid_private_key=settings.VAPID_PRIVATE_KEY,
            vapid_claims={"sub": f"mailto:{settings.VAPID_ADMIN_EMAIL}"},
        )
    except WebPushException as exc:
        logger.warning("Push failed for %s: %s", subscription.endpoint[:40], exc)
        # 410 Gone = subscription expired/revoked — clean it up
        if getattr(exc, 'response', None) is not None and exc.response.status_code == 410:
            subscription.delete()
    except Exception as exc:
        logger.warning("Push error: %s", exc)


def _fan_out(subscriptions, title, body, url='/'):
    """Send to a queryset of PushSubscription in background threads."""
    for sub in subscriptions:
        threading.Thread(target=_send, args=(sub, title, body, url), daemon=True).start()


def notify_new_lesson(slot):
    """
    Notify subscribed users when a new lesson slot is published.
    Targets users whose most recent active booking matches the slot level,
    or users with no lesson history (new surfers — show everything).
    """
    from .models import PushSubscription, Booking

    level_labels = {
        'beginner': 'Principianti',
        'intermediate': 'Intermedi',
        'advanced': 'Avanzati',
    }
    label = level_labels.get(slot.level, slot.level.capitalize())
    date_str = slot.lesson.date.strftime('%d/%m')
    time_str = slot.lesson.time.strftime('%H:%M')

    subs = PushSubscription.objects.filter(notify_lessons=True).select_related('user')
    targets = []
    for sub in subs:
        last = (
            Booking.objects
            .filter(user=sub.user, status='booked')
            .order_by('-slot__lesson__date')
            .select_related('slot')
            .first()
        )
        # Notify if no history (new users) or their level matches
        if last is None or last.slot.level == slot.level:
            targets.append(sub)

    _fan_out(
        targets,
        title="🏄 Nuova Lezione Disponibile!",
        body=f"{date_str} · {time_str} · {label} con {slot.instructor}",
        url='/dashboard',
    )


def notify_surf_call(surf_call):
    """Notify all subscribed users when a surf call opens or goes SESSION ON."""
    from .models import PushSubscription

    if surf_call.status == 'waiting':
        title = "🌊 Surf Call Aperta!"
        body = (
            f"{surf_call.title} — Finestra aperta "
            f"{surf_call.start_date.strftime('%d/%m')}–{surf_call.end_date.strftime('%d/%m')}"
        )
    elif surf_call.status == 'on':
        title = "🚀 SESSION ON — Andate!"
        body = f"{surf_call.title} — La sessione è partita, correte in acqua!"
    else:
        return

    subs = PushSubscription.objects.filter(notify_surf_call=True)
    _fan_out(subs, title=title, body=body, url='/')
