
import './App.css'
import { FrappeProvider } from 'frappe-react-sdk'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { SadhanaReport } from './components/SadhanaReport/SadhanaReport';
import SingleDevoteeReport from './components/SingleDevoteeReport/SingleDevoteeReport';
function App() {

	const router = createBrowserRouter(
		createRoutesFromElements(
			<>
				<Route path="/" lazy={() => import("./components/Welcome")} />
				<Route path="/sadhana_public/:public_key" element={<SadhanaReport />} />
				<Route path="/sadhana_individual/:public_key/:devotee" element={<SingleDevoteeReport />} />
			</>
		),
		{
			basename: `/dev_diary_spw` ?? "",
		}
	);

	return (
		<>
			<Box p={5}>
				<FrappeProvider
				>
					<RouterProvider router={router}></RouterProvider>
				</FrappeProvider>
			</Box>
		</>
	);
}

export default App;
