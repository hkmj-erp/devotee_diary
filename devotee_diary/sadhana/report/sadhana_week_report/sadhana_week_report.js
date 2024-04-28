// Copyright (c) 2024, Narahari Dasa and contributors
// For license information, please see license.txt

frappe.query_reports["Sadhana Week Report"] = {
	"filters": [
		{
			"fieldname": "date_range",
			"label": __("Date Range"),
			"fieldtype": "DateRange",
			"default": [frappe.datetime.add_months(frappe.datetime.get_today(), -1), frappe.datetime.get_today()],
			"reqd": 1
		},
		{
			"fieldname": "first_day_of_week",
			"label": __("First Day of Week"),
			"fieldtype": "Select",
			"options":[
			{
				"label":"Sunday",
				"value":6
			},
			{
				"label":"Monday",
				"value":0
			},
			{
				"label":"Tuesday",
				"value":1
			},
			{
				"label":"Wednesday",
				"value":0
			},
			{
				"label":"Thursday",
				"value":0
			},
			{
				"label":"Friday",
				"value":0
			},
			{
				"label":"Saturday",
				"value":0
			},
			
		],
			"default":6
		},
	]
};
