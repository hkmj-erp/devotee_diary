frappe.treeview_settings["DED Devotee"] = {
  breadcrumb: "Devotees",
  get_tree_root: false,
  root_label: "All Devotees",
  get_tree_nodes:
    "devotee_diary.devotee_diary.doctype.ded_devotee.ded_devotee.get_children",
  add_tree_node:
    "devotee_diary.devotee_diary.doctype.ded_devotee.ded_devotee.add_node",
  ignore_fields: ["parent_ded_devotee"],
  onload: function (treeview) {
    treeview.make_tree();
  },
  fields: [
    {
      fieldtype: "Data",
      fieldname: "initial",
      label: __("Devotee Initial"),
      reqd: true,
    },
    {
      fieldtype: "Data",
      fieldname: "full_name",
      label: __("Devotee Full Name"),
      reqd: true,
    },
    {
      fieldtype: "Link",
      options: "User",
      fieldname: "erp_user",
      label: __("ERP User Account"),
    },
    {
      fieldtype: "Check",
      fieldname: "is_group",
      label: __("Is DCS"),
    },
  ],
};
