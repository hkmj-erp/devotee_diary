from devotee_diary.api.reports import get_cummulative_sadhana
import frappe


@frappe.whitelist(allow_guest=True)
def get_public_report(public_key, report_type, from_date, to_date):
    from frappe.utils.nestedset import get_root_of

    settings = frappe.get_cached_doc("Sadhana Settings")
    if public_key != settings.public_key:
        frappe.throw("You are not allowed to view reports.")

    root_devotee = "Admin"

    if report_type == "cummulative":
        return get_cummulative_sadhana(from_date, to_date, parent_devotee=root_devotee)

    frappe.throw("Report not Found")
