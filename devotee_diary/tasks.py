import frappe
from datetime import datetime, timedelta


def sadhana_reminder_1():
    sadhana_reminder(hour=15)


def sadhana_reminder_2():
    sadhana_reminder(hour=20)


def sadhana_reminder(hour):
    yesterday = datetime.now() - timedelta(days=1)

    devotees_done = frappe.get_all(
        "Sadhana Entry", filters={"entry_date": yesterday}, pluck="devotee"
    )
    settings_doc = frappe.get_cached_doc("Sadhana Settings")
    message = ""
    if hour == 15:
        message = "You have not filled Sadhana for Yesterday. Please do."
    else:
        message = "Please fill Sadhana for Yesterday. It will be locked in few hours."

    for erp_user in frappe.get_all(
        "DED Devotee",
        filters=[["erp_user", "is", "set"], ["name", "not in", devotees_done]],
        pluck="erp_user",
    ):
        frappe.get_doc(
            {
                "doctype": "App Notification",
                "app": settings_doc.firebase_admin_app,
                "channel": settings_doc.sadhana_reminder_channel,
                "user": erp_user,
                "subject": "Sadhana Reminder",
                "message": message,
            }
        ).insert()
    frappe.db.commit()
