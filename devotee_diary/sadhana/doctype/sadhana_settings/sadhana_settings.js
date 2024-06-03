// Copyright (c) 2023, Narahari Dasa and contributors
// For license information, please see license.txt

frappe.ui.form.on("Sadhana Settings", {
  generate_public_link: function (frm) {
    frappe.call({
      freeze: true,
      freeze_message: "Generating...",
      method:
        "devotee_diary.sadhana.doctype.sadhana_settings.sadhana_settings.generate_public_link",
      callback: function (r) {
        if (!r.exc) {
          frappe.msgprint("Done. Please Refresh");
        }
      },
    });
  },
});
