import { useFrappeGetCall } from "frappe-react-sdk";
import React from "react";

export default function SadhanaAdmin() {
  const { data: receivedData } = useFrappeGetCall<{ message: any }>(
    "devotee_diary.api.reports.get_cummulative_sadhana",
    { from_date: "2024-01-01", to_date: "2024-05-31" }
  );

  return (
    <>
      <div>SadhanaAdmin</div>
      <div>{receivedData?.message}</div>
    </>
  );
}
