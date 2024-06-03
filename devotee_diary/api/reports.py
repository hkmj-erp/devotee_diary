from devotee_diary.api.general import get_devotee_from_user
import frappe
from frappe.utils.nestedset import get_descendants_of
from datetime import datetime


@frappe.whitelist()
def get_cummulative_sadhana(from_date, to_date, parent_devotee=None):

    parameters = frappe.get_all(
        "Sadhana Parameter", filters={"active": 1}, pluck="name",order_by="priority"
    )

    devotee_data = {}
    if not parent_devotee:
        parent_devotee = get_devotee_from_user()
    dcs_devotees = get_descendants_of(
        "DED Devotee", parent_devotee, ignore_permissions=True
    )
    dcs_devotees.append(parent_devotee)
    for d in frappe.get_all(
        "DED Devotee",
        fields=["name", "full_name", "parent_ded_devotee"],
        filters={"name": ("in", dcs_devotees), "enabled": 1},
    ):
        devotee_data.setdefault(
            d["name"],
            {
                "devotee": d["full_name"],
                "devotee_initial": d["name"],
                "parent": d["parent_ded_devotee"],
                "total": 0,
                **{
                    p: {
                        "parameter": p,
                        "count": 0,
                        "points": 0,
                        "sick": 0,
                        "authorised_service": 0,
                    }
                    for p in parameters
                },
            },
        )

    for entry in frappe.db.sql(
        f"""
            select entry_date,devotee,tsd.parameter,tsd.points,tsd.authorised_service,tsd.sick
            from `tabSadhana Entry` ts
            join `tabSadhana Entry Detail` tsd
            on ts.name = tsd.parent
            where entry_date between '{from_date}' and '{to_date}'
            and ts.devotee IN ({",".join([ f'"{k}"'  for k in devotee_data.keys()])})
                """,
        as_dict=1,
    ):
        ## In Case of Authorised service, points increase but not in case of SICK
        if entry["authorised_service"]:
            devotee_data[entry["devotee"]][entry["parameter"]][
                "authorised_service"
            ] += 1.0
            devotee_data[entry["devotee"]][entry["parameter"]]["points"] += 1.0
        if entry["sick"]:
            devotee_data[entry["devotee"]][entry["parameter"]]["sick"] += 1.0
        if entry["points"]:
            devotee_data[entry["devotee"]][entry["parameter"]]["count"] += 1.0
            devotee_data[entry["devotee"]][entry["parameter"]]["points"] += entry[
                "points"
            ]
    from_date = datetime.strptime(from_date, "%Y-%m-%d")
    to_date = datetime.strptime(to_date, "%Y-%m-%d")
    total_days = (to_date - from_date).days + 1

    data = list(devotee_data.values())

    for d in data:
        parameter_count = 0
        sick_count = 0
        as_count = 0
        paramters_list = []
        for p in parameters:
            parameter_count += 1
            if d[p]["points"] > total_days:
                d[p]["points"] = total_days
            d["total"] += d[p]["points"]
            sick_count += d[p]["sick"]
            as_count += d[p]["authorised_service"]
            paramters_list.append(d[p])
            del d[p]
        d["parameters"] = paramters_list
        d["total_days"] = total_days
        d["total_sick"] = sick_count
        d["total_as"] = as_count
        d["percentage"] = round(
            (d["total"] / (total_days * parameter_count - sick_count)) * 100
        )
    data = sorted(data, key=lambda x: x["devotee"])
    return data


@frappe.whitelist()
def get_devotee_records(devotee, from_date, to_date):
    if not devotee:
        devotee = get_devotee_from_user()
    return frappe.db.sql(
        f"""
            select entry_date,devotee,tsd.parameter,tsd.points,tsd.authorised_service,tsd.sick
            from `tabSadhana Entry` ts
            join `tabSadhana Entry Detail` tsd
            on ts.name = tsd.parent
            where entry_date between '{from_date}' and '{to_date}'
            and ts.devotee = '{devotee}'
                """,
        as_dict=1,
    )
