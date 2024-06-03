# Copyright (c) 2023, Narahari Dasa and contributors
# For license information, please see license.txt

import frappe
from cryptography.fernet import Fernet
from frappe.model.document import Document
from frappe.utils import random_string
from frappe.utils.data import cstr


class SadhanaSettings(Document):
    pass


@frappe.whitelist()
def generate_public_link():
    settings = frappe.get_cached_doc("Sadhana Settings")
    settings.public_key = random_string(15)
    site_name = cstr(frappe.local.site)
    settings.public_link = (
        f"https://{site_name}/devotee_diary_spw/sadhana_report/{settings.public_key}"
    )
    settings.save()
