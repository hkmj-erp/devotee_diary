import { useState } from "react";
import { FrappeProvider } from "frappe-react-sdk";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Box } from "@chakra-ui/react";
import SadhanaAdmin from "./components/SadhanaAdmin";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" lazy={() => import("./components/Welcome")} />
        <Route path="/admin" element={<SadhanaAdmin />} />
        {/* <Route path="/success" lazy={() => import("./components/success")} />
				<Route path="/window/:id" element={<IssueWindow />} />
				<Route path="/find_coupons" element={<FindCoupons />} /> */}
      </>
    ),
    {
      basename: `/sadhana` ?? "",
    }
  );

  return (
    <>
      <Box p={5}>
        <FrappeProvider>
          <RouterProvider router={router}></RouterProvider>
        </FrappeProvider>
      </Box>
    </>
  );
}

export default App;
