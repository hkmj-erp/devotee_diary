from devotee_diary.api.reports import get_cummulative_sadhana, get_devotee_records
import frappe


@frappe.whitelist(allow_guest=True)
def get_public_report(public_key, report_type, from_date, to_date, devotee=None):
    from frappe.utils.nestedset import get_root_of

    settings = frappe.get_cached_doc("Sadhana Settings")
    if public_key != settings.public_key:
        frappe.throw("You are not allowed to view reports.")

    if devotee is None:
        devotee = "Admin"

    if report_type == "cummulative":
        return get_cummulative_sadhana(from_date, to_date, parent_devotee=devotee)

    if report_type == "individual":
        return get_devotee_records(devotee, from_date, to_date)

    frappe.throw("Report not Found")
