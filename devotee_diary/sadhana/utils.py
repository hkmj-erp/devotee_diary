import frappe


@frappe.whitelist()
def get_parameters():
    parameters = []
    detail = frappe.qb.DocType("Sadhana Parameter Detail")
    for parameter in frappe.get_all(
        "Sadhana Parameter", fields=["*"], order_by="priority"
    ):
        details = (
            frappe.qb.from_(detail)
            .select("grade", "remarks", "points")
            .orderby("idx")
            .where(detail.parent == parameter["name"])
            .run(as_dict=1)
        )
        parameter.update(options=[d["grade"] for d in details])
        parameter.update(remarks=[d["remarks"] for d in details])
        parameter.update(points=[d["points"] for d in details])
        parameters.append(parameter)
    return parameters
