# Copyright (c) 2023, Narahari Dasa and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.utils.nestedset import NestedSet

DIARY_ROLE = "DED User"


class DEDDevotee(NestedSet):
    def validate(self):
        if self.erp_user:
            if frappe.db.exists(
                "DED Devotee", {"erp_user": self.erp_user, "name": ["!=", self.name]}
            ):
                frappe.throw(
                    "This ERP User is already allocated to some other Devotee."
                )
        return

    def on_update(self):
        super(DEDDevotee, self).on_update()
        if DIARY_ROLE not in frappe.get_roles(self.erp_user):
            user = frappe.get_doc("User", self.erp_user)
            user.add_roles([DIARY_ROLE])
        return

    # def validate_primary(self):
    #     for au in self.get("allowed_users"):
    #         res = frappe.db.sql(
    #             """select dd.name


# 			from
# 				`tabDED Devotee User` ddu, `tabDED Devotee` dd
# 			where
# 				dd.name = ddu.parent and ddu.user = %s and dd.name != %s
# 				and ddu.primary=1""",
#             (au.user, self.name),
#         )

#         if au.primary and res:
#             frappe.msgprint(
#                 _(
#                     "Already set primary in Devoteee {0} for user {1}, kindly disabled primary"
#                 ).format(res[0][0], au.user),
#                 raise_exception=1,
#             )
#         elif not au.primary and not res:
#             frappe.msgprint(
#                 _(
#                     "User {0} doesn't have any primary Devotee. Check Primary at Row {1} for this User."
#                 ).format(au.user, au.idx)
#             )


@frappe.whitelist()
def get_children(doctype, parent, is_root=False):

    filters = [["enabled", "=", "1"]]

    if parent and not is_root:
        # via expand child
        filters.append(["parent_ded_devotee", "=", parent])
    else:
        filters.append(['ifnull(`parent_ded_devotee`, "")', "=", ""])

    types = frappe.get_list(
        doctype,
        fields=["name as value", "full_name as title", "is_group as expandable"],
        filters=filters,
        order_by="name",
    )

    return types


@frappe.whitelist()
def add_node():
    from frappe.desk.treeview import make_tree_args

    args = frappe.form_dict
    args = make_tree_args(**args)

    if args.parent_ded_devotee == "All Types":
        args.parent_ded_devotee = None

    frappe.get_doc(args).insert()
