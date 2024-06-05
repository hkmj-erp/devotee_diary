import { useFrappeGetCall } from 'frappe-react-sdk';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import { SadhanaSingleEntry } from './models';
import { Category, ChartComponent, DataLabel, DateTime, Inject, Legend, SeriesCollectionDirective, SeriesDirective, SplineSeries, Tooltip } from '@syncfusion/ej2-react-charts';
import { getMonthlyData } from './DataOperation';
import { Box, Card, CardHeader } from '@chakra-ui/react';
import { SadhanaReportFilters } from '../SadhanaReport/Filters';
import { Container, Divider } from 'rsuite';

const parameters = ["Mangla Aarti",
    "Morning Japa",
    "Darshan Aarti",
    "Bhagavatam Class",
    "Reading",
    "Round Completion",
    "Service"];

export default function SingleDevoteeReport() {
    let { public_key, devotee } = useParams();
    let [sadhanaData, setSadhanaData] = useState<any>([]);
    const today = new Date();
    const sixMonthAgo = new Date(
        today.getFullYear(),
        today.getMonth() - 6,
        today.getDate()
    );

    const [dateRange, setDateRange] = useState<Date[]>([sixMonthAgo, today]);
    const onDateRangeChange = (value: DateRange | null) => {
        if (value != null) {
            setDateRange(value);
        }
    }

    const { data: receivedData } = useFrappeGetCall<{
        message: SadhanaSingleEntry[];
    }>("devotee_diary.api.public.get_public_report", {
        public_key: public_key,
        report_type: "individual",
        from_date: dateRange[0].toISOString().split("T")[0],
        to_date: dateRange[1].toISOString().split("T")[0],
        devotee: devotee
    });

    useEffect(() => {
        if (receivedData != undefined) {
            var sData: any = [];
            parameters.forEach((p) => {
                sData.push(getMonthlyData(receivedData?.message.filter(item => item.parameter == p)));
            })
            console.log(sData);
            setSadhanaData(sData);
        }
    }, [receivedData]);
    const marker = { visible: true, width: 10, height: 10, dataLabel: { visible: true } };
    const animation = { enable: true, duration: 1200, delay: 100 };
    return (
        <>
            <Card >
                <CardHeader>
                    <SadhanaReportFilters
                        dateRange={dateRange}
                        onDateRangeChange={onDateRangeChange}
                    />
                </CardHeader>
            </Card>

            <Box my={10}></Box>
            <Box p={5}>
                <Container>
                    {
                        sadhanaData.map((parameterData: SadhanaSingleEntry[], index: number) => {
                            return (
                                <>
                                    <ChartComponent id={'charts-' + index}
                                        title={parameters[index]}
                                        legendSettings={{ visible: true, position: 'Top' }}
                                        enableAnimation={true}
                                        primaryXAxis={{ valueType: 'DateTime', labelFormat: 'MMM-yy', intervalType: 'Months', interval: 1 }}
                                    >
                                        <SeriesCollectionDirective>
                                            <SeriesDirective dataSource={parameterData} width={5} xName='entry_date' yName='points' name='Points' type='Spline' colorName='orange' marker={marker} legendShape='Circle' animation={animation} />
                                            <SeriesDirective dataSource={parameterData} width={5} xName='entry_date' yName='authorised_service' type='Spline' name='Authorised Service' colorName='green' marker={marker} legendShape='Rectangle' animation={animation} />
                                            <SeriesDirective dataSource={parameterData} width={5} xName='entry_date' yName='sick' type='Spline' name='Sick' colorName='black' marker={marker} legendShape='Rectangle' animation={animation} />
                                        </SeriesCollectionDirective>
                                        <Inject services={[SplineSeries, DateTime, Legend, Tooltip, DataLabel]} />
                                    </ChartComponent>
                                    <Divider />
                                </>
                
                            )
                        }
                        )
                    }

                </Container>
            </Box>


        </>
    );
}
