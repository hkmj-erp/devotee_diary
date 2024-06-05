import {
    ColumnDirective,
    ColumnsDirective,
    Filter,
    Freeze,
    GridComponent,
    Group,
    Inject,
    Resize,
    Sort,
} from "@syncfusion/ej2-react-grids";
import { Box, Card, CardHeader, Center, Spinner, Text } from "@chakra-ui/react";
import { useFrappeGetCall } from "frappe-react-sdk";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SadhanaReportFilters } from "./Filters";
import { DateRange } from "rsuite/esm/DateRangePicker";
import { SadhanaReportRow } from "./models";
import { DevoteeTemplate, ParameterTemplate } from "./Templates";
import { sadhanaGroupOptions, sadhanaSortComparer } from "./TableOptions";
import { color } from "framer-motion";

export const SadhanaReport = () => {
    let { public_key } = useParams();
    let [sadhanaData, setSadhanaData] = useState<any>([]);
    let [loading, setLoading] = useState(false);
    const today = new Date();
    const oneMonthAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
    );
    const [dateRange, setDateRange] = useState<Date[]>([oneMonthAgo, today]);
    const onDateRangeChange = (value: DateRange | null) => {
        if (value != null) {
            setDateRange(value);
        }
    }

    const { data: receivedData } = useFrappeGetCall<{
        message: SadhanaReportRow[];
    }>("devotee_diary.api.public.get_public_report", {
        public_key: public_key,
        report_type: "cummulative",
        from_date: dateRange[0].toISOString().split("T")[0],
        to_date: dateRange[1].toISOString().split("T")[0],
    });
    useEffect(() => {
        if (receivedData != undefined) {
            setLoading(true);
            let convertedData: any[] = [];
            receivedData?.message.forEach((v) => {
                const { ["parameters"]: _, ...newData } = v;
                v.parameters.forEach((p) => ((newData as any)[p.parameter] = p));
                convertedData.push(newData);
            });

            setSadhanaData(convertedData);
            setLoading(false);
        }
    }, [receivedData]);


    return (
        <>
            <Card >
                <CardHeader style={{ zIndex: '0 !important' }}>
                    <SadhanaReportFilters
                        dateRange={dateRange}
                        onDateRangeChange={onDateRangeChange}
                    />
                </CardHeader>

            </Card>

            <Box my={10}></Box>
            {loading ? <Spinner size='md' /> : <GridComponent
                dataSource={sadhanaData}
                allowSorting={true}
                frozenColumns={1}
                gridLines="Both"
                allowGrouping={true}
                groupSettings={sadhanaGroupOptions}
                height={500}
                allowResizing={true}
                enablePersistence={true}


            >
                <ColumnsDirective>

                    <ColumnDirective field='devotee' headerText='Devotee' isPrimaryKey={true} width='150' template={(props: SadhanaReportRow) => DevoteeTemplate(props, public_key!)} ></ColumnDirective>
                    <ColumnDirective field="parent" visible={false} width='130' ></ColumnDirective>
                    <ColumnDirective field="total_days" headerText="Days" width='130' allowFiltering={false} textAlign={"Center"}></ColumnDirective>
                    <ColumnDirective field="percentage" headerText="%" width='130'
                        textAlign={"Center"}
                        template={(props: SadhanaReportRow) => <Text size="md" color="green">{props.percentage}%</Text>}></ColumnDirective>
                    {
                        [
                            "Mangla Aarti",
                            "Morning Japa",
                            "Darshan Aarti",
                            "Bhagavatam Class",
                            "Reading",
                            "Round Completion",
                            "Service"].map((p) => <ColumnDirective field={p} headerText={p} width='130' template={(props: any) => ParameterTemplate(props[p])}
                                sortComparer={sadhanaSortComparer}
                                allowFiltering={false}
                                allowGrouping={false}
                            ></ColumnDirective>)
                    }
                    <ColumnDirective textAlign={"Center"} field="total_as" headerText="Total AS" width='130'></ColumnDirective>
                    <ColumnDirective textAlign={"Center"} field="total_sick" headerText="Total Sick" width='130'></ColumnDirective>
                    <ColumnDirective textAlign={"Center"} field="total" headerText="Points" width='130'></ColumnDirective>
                </ColumnsDirective>
                <Inject services={[Sort, Freeze, Group, Filter, Resize]} />
            </GridComponent>}

        </>
    );
}
