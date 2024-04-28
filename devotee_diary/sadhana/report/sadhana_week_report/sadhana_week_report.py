# Copyright (c) 2024, Narahari Dasa and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime, timedelta


def execute(filters=None):
    if not filters:
        filters = {}

    filters.update(
        {
            "from_date": filters.get("date_range") and filters.get("date_range")[0],
            "to_date": filters.get("date_range") and filters.get("date_range")[1],
        }
    )

    dates_week = starting_dates_with_week_numbers(filters)

    begin_date = dates_week[0]["start_date"]

    end_date = dates_week[-1]["end_date"]

    columns = get_columns(dates_week)

    devotee_data = {}

    for d in frappe.get_all("DED Devotee", fields=["name", "full_name"]):
        devotee_data.setdefault(d["name"], {"devotee": d["full_name"], "total": 0})
        devotee_data[d["name"]].update(
            {dw["start_date"]: {"points": 0, "sick": 0} for dw in dates_week}
        )

    for entry in frappe.db.sql(
        f"""
			select entry_date,devotee,tsd.parameter,tsd.points,tsd.authorised_service,tsd.sick
			from `tabSadhana Entry` ts
			join `tabSadhana Entry Detail` tsd
			on ts.name = tsd.parent
			where entry_date between '{begin_date}' and '{end_date}'
				""",
        as_dict=1,
    ):
        for dw in dates_week:
            if (
                datetime.strptime(dw["start_date"], "%Y-%m-%d").date()
                <= entry["entry_date"]
                <= datetime.strptime(dw["end_date"], "%Y-%m-%d").date()
            ):
                if entry["authorised_service"]:
                    devotee_data[entry["devotee"]][dw["start_date"]]["points"] += 1.0
                if entry["sick"]:
                    devotee_data[entry["devotee"]][dw["start_date"]]["sick"] += 1.0
                if entry["points"]:
                    devotee_data[entry["devotee"]][dw["start_date"]]["points"] += entry[
                        "points"
                    ]
                break

    parameters = frappe.get_all(
        "Sadhana Parameter", filters={"active": 1}, pluck="name"
    )

    max_week_value = 7 * len(parameters)

    for key, value in devotee_data.items():
        for dw in dates_week:
            base = max_week_value - value[dw["start_date"]]["sick"]
            value[dw["start_date"]] = round(
                (value[dw["start_date"]]["points"] / base) * 100
            )
            if value[dw["start_date"]] > 100:
                value[dw["start_date"]] = 100
            value["total"] += value[dw["start_date"]]
        value["total"] = round(value["total"] / len(dates_week))
    data = sorted(list(devotee_data.values()), key=lambda x: x["total"], reverse=True)
    return columns, data


def get_sadhana_data_of_week():
    pass


def starting_dates_with_week_numbers(filters):
    first_day_of_week = int(filters.get("first_day_of_week"))
    from_date = datetime.strptime(filters.get("from_date"), "%Y-%m-%d").date()
    to_date = datetime.strptime(filters.get("to_date"), "%Y-%m-%d").date()

    start_week = from_date - timedelta(
        days=(from_date.weekday() - first_day_of_week) % 7
    )
    end_week = to_date - timedelta(days=(to_date.weekday() - first_day_of_week) % 7)

    starting_dates = []
    while start_week <= end_week:
        starting_dates.append(
            {
                "start_date": start_week.strftime("%Y-%m-%d"),
                "end_date": (start_week + timedelta(days=6)).strftime("%Y-%m-%d"),
                "week_number": start_week.isocalendar()[1],
            }
        )
        start_week += timedelta(weeks=1)

    return starting_dates


def get_columns(dates_week):
    columns = [
        {
            "label": "Devotee",
            "fieldname": "devotee",
            "fieldtype": "Data",
            "width": 120,
        },
    ]

    for dw in dates_week:
        columns.append(
            {
                "label": f"W{dw['week_number']}",
                "fieldname": dw["start_date"],
                "fieldtype": "Percent",
                "width": 120,
            }
        )
    columns.append(
        {
            "label": "Total %",
            "fieldname": "total",
            "fieldtype": "Percent",
            "width": 120,
        }
    )
    return columns
