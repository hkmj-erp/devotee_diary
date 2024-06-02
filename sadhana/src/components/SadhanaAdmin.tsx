import { useFrappeGetCall } from "frappe-react-sdk";
import React from "react";

export default function SadhanaAdmin() {
  const { data: windowDetails } = useFrappeGetCall<{ message: any }>(
    "prasadam_flow.api.v1.window.get_window_details",
    { encrypted_window_id: id }
  );

  return <div>SadhanaAdmin</div>;
}
